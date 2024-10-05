package main

import (
	"context"
	"database/sql"
	"log"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func isValidFormat(file *multipart.FileHeader, allowedExtensions []string) bool {
	fileExtension := strings.ToLower(filepath.Ext(file.Filename))

	for _, extension := range allowedExtensions {
		if fileExtension == extension {
			return true
		}
	}

	return false
}

func insertInfoDB(db *sql.DB, tableName string, filename string, id int, fileId string, fileExtension string) {
	strs := strings.Split(tableName, "_")
	insertInfo := `INSERT INTO ` + tableName + ` (
		"` + strs[0] + `id", "filename", "fileextension", "` + strs[1] + `id")
		VALUES(` + strconv.Itoa(id) + `, ` + "\"" + filename + "\"" + `, ` + "\"" + fileExtension + "\"" + `, ` + "\"" + fileId + "\"" + `);`

	statement, err := db.Prepare(insertInfo)
	if err != nil {
		log.Fatal(err.Error())
	}

	statement.Exec()
	log.Println("New row (" + strconv.Itoa(id) + ", " + filename + ", " + fileExtension + ", " + fileId + ")" + " added to " + tableName + ".")
}

func upload(minioClient *minio.Client, c *gin.Context, bucketName string, db *sql.DB, tableName string, id int) bool {
	if !fileExistsForOwner(db, tableName, id) {
	file, _ := c.FormFile("file")

	formats := []string{".png", ".jpg", ".pdf", ".docx"}

	if isValidFormat(file, formats) {
		fileExtension := strings.ToLower(filepath.Ext(file.Filename))
		originalFilename := time.Now().Local().String() + "_" + file.Filename
		originalFilename = strings.Replace(originalFilename, " ", "_", -1)
		originalFilename = strings.TrimSuffix(originalFilename, fileExtension)

		file.Filename = uuid.NewString() //File name to store in minio

		c.SaveUploadedFile(file, "./"+file.Filename)

		object, err := os.Open("./" + file.Filename)
		if err != nil {
			log.Fatalln(err)
		}
		defer object.Close()
		objectStat, err := object.Stat()
		if err != nil {
			log.Fatalln(err)
		}

		info, err := minioClient.PutObject(context.Background(), bucketName, file.Filename, object, objectStat.Size(), minio.PutObjectOptions{ContentType: "application/octet-stream"})
		if err != nil {
			log.Fatalln(err)
		}
		log.Println("Uploaded", file.Filename, " of size: ", info.Size, "Successfully.")
		insertInfoDB(db, tableName, originalFilename, id, file.Filename, fileExtension)

		os.Remove("./" + file.Filename)
		return true
	}
}
	log.Println("file already exists.")
	return false
}

func tableExists(db *sql.DB, tableName string) bool {
	var count int = 0
	db.QueryRow("SELECT count(*) from sqlite_master WHERE name=?", tableName).Scan(&count)
	return count > 0
}

func createTables(db *sql.DB, tables []string) {
	for _, tableName := range tables {
		if !tableExists(db, tableName) {
			strs := strings.Split(tableName, "_")
			createTable := `CREATE TABLE ` + tableName + `(
				"` + strs[0] + `id" integer NOT NULL PRIMARY KEY,		
				"filename" TEXT,
				"fileextension" TEXT,
				"` + strs[1] + `id" TEXT
				);`

			statement, err := db.Prepare(createTable)
			if err != nil {
				log.Fatal(err.Error())
			}

			statement.Exec()
			log.Println(tableName + " table have been created.")
		} else {
			log.Println(tableName + " already exists.")
		}
	}
}

func fileExistsForOwner(db *sql.DB, tableName string, id int) bool {
	var count int = 0
	strs := strings.Split(tableName, "_")
	db.QueryRow("SELECT count(*) from "+tableName+" WHERE "+strs[0]+"id=?", id).Scan(&count)
	return count > 0
}


func main() {
	r := gin.Default()

	endpoint := "localhost:9000"
	accessKeyID := "1ZKMFFahuTs4p32JM21T"
	secretAccessKey := "dMLofPRtK82HRYLF5D1EqOB5uY2nGDcu0bnQKE4G"
	useSSL := false

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalln(err)
	}

	log.Printf("%#v\n", minioClient)

	opts := minio.MakeBucketOptions{
		Region: "auto",
	}

	info, err := os.Stat("./sqlite.db")

	if info == nil {
		if os.IsNotExist(err) {
			file, err := os.Create("./sqlite.db")
			if err != nil {
				log.Fatal(err.Error())
			}
			file.Close()
		}
	}

	tables := []string{"course_cover", "user_avatar", "course_file"}

	db, _ := sql.Open("sqlite3", "./sqlite.db")
	createTables(db, tables)
	defer db.Close()

	bucketNames := [3]string{"coursecovers", "profileavatars", "coursefiles"}

	for _, bN := range bucketNames {
		err = minioClient.MakeBucket(context.Background(), bN, opts)
		if err != nil {
			log.Println(err)
		} else {
			log.Println("Successfully created bucket: " + bN)
		}
	}

	r.POST("/upload/cover/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		if upload(minioClient, c, bucketNames[0], db, tables[0], id) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		} else {
			c.JSON(415, gin.H{
				"error": "unsupported file format",
			})
		}
	})

	r.POST("/upload/avatar/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		if upload(minioClient, c, bucketNames[1], db, tables[1], id) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		} else {
			c.JSON(415, gin.H{
				"error": "unsupported file format",
			})
		}
	})

	r.POST("/upload/coursefile/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		if upload(minioClient, c, bucketNames[2], db, tables[2], id) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		} else {
			c.JSON(415, gin.H{
				"error": "unsupported file format",
			})
		}
	})

	r.GET("/avatar/:id", func(c *gin.Context) {
		var fileExtension string
		var avatarId string
		db.QueryRow("SELECT fileextension, avatarid from "+tables[1]+" WHERE userid=?", c.Param("id")).Scan(&fileExtension, &avatarId)

		reqParams := make(url.Values)
		reqParams.Set("response-content-disposition", "attachment; filename=\""+avatarId+fileExtension+"\"")

		presignedURL, err := minioClient.PresignedGetObject(context.Background(), bucketNames[1], avatarId, time.Duration(1000)*time.Second, reqParams)
		if err != nil {
			log.Fatalln(err)
			c.JSON(415, gin.H{
				"error": "unsupported file format",
			})
		}
		log.Println(presignedURL)
		c.JSON(200, gin.H{
			"url": presignedURL.String(),
		})
	})

	r.Run(":8082")
}
