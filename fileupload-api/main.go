package main

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
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

func upload(minioClient *minio.Client, c *gin.Context, bucketName string) bool {
	file, _ := c.FormFile("file")

	formats := []string{".png", ".jpg", ".pdf", ".docx"}

	if isValidFormat(file, formats) {
		file.Filename = time.Now().Local().String() + "_" + file.Filename
		file.Filename = strings.Replace(file.Filename, " ", "_", -1)
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

		os.Remove("./" + file.Filename)
		return true
	}
	return false
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

	bucketNames := [3]string{"coursecovers", "profileavatars", "coursefiles"}

	for _, bN := range bucketNames {
		fmt.Println(bN)
		err = minioClient.MakeBucket(context.Background(), bN, opts)
		if err != nil {
			log.Println(err)
		} else {
			log.Println("Successfully created bucket: " + bN)
		}
	}

	r.POST("/cover/upload", func(c *gin.Context) {
		if upload(minioClient, c, bucketNames[2]) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		}
		c.JSON(415, gin.H{
			"error": "unsupported file format",
		})
	})

	r.POST("/avatar/upload", func(c *gin.Context) {
		if upload(minioClient, c, bucketNames[2]) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		}
		c.JSON(415, gin.H{
			"error": "unsupported file format",
		})
	})

	r.POST("/coursefile/upload", func(c *gin.Context) {
		if upload(minioClient, c, bucketNames[2]) {
			c.JSON(200, gin.H{
				"message": "file uploaded successfully.",
			})
		}
		c.JSON(415, gin.H{
			"error": "unsupported file format",
		})
	})

	r.Run(":8082")
}
