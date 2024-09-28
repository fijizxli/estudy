package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const uri = "mongodb://root:example@localhost:27017/ratings?authSource=admin"

type Rating struct {
	ID                      primitive.ObjectID `json:"id" bson:"_id"`
	Lecturer                int                `json:"lecturer" bson:"lecturer"`
	QualityOfLectures       int                `json:"qualityOfLectures" bson:"qualityOfLectures"`
	QualityOfStudyMaterials int                `json:"qualityOfStudyMaterials" bson:"qualityOfStudyMaterials"`
	Personality             int                `json:"personality" bson:"personality"`
	Comment                 string             `json:"comment" bson:"comment"`
}

type CourseRating struct {
	ID                      primitive.ObjectID `json:"id" bson:"_id"`
	Lecturer                int                `json:"course" bson:"course"`
	QualityOfLectures       int                `json:"practicalApplication" bson:"practicalApplication"`
	QualityOfStudyMaterials int                `json:"assignments" bson:"assignments"`
	Personality             int                `json:"grading" bson:"grading"`
	Comment                 string             `json:"comment" bson:"comment"`
	DateAdded               primitive.DateTime `json:"-" bson:"date-added"`
}

type Course struct {
	ID           int                  `json:"id" bson:"_id"`
	Title        string               `json:"title" bson:"title"`
	Description  string               `json:"description" bson:"description"`
	LecturerName string               `json:"lecturerName" bson:"lecturerName"`
	Lecturer     int                  `json:"-" bson:"lecturer"`
	Ratings      []primitive.ObjectID `json:"-" bson:"ratings"`
}

type Lecturer struct {
	ID           int                  `json:"id" bson:"_id"`
	Username     string               `json:"username" bson:"username"`
	EmailAddress string               `json:"emailAddress" bson:"emailAddress"`
	CourseIDs    []int                `json:"-" bson:"coursesTaught"`
	Courses      []Course             `json:"coursesTaught" bson:"-"`
	Ratings      []primitive.ObjectID `json:"-" bson:"ratings"`
}

func processCourses(courses []Course, lecturerID int, courseCollection mongo.Collection) []int {
	var courseIDs []int
	for _, course := range courses {
		courseIDs = append(courseIDs, course.ID)
		course.Lecturer = lecturerID
		res, err := courseCollection.InsertOne(context.TODO(), course)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Inserted document with _id: %v\n", res.InsertedID)
	}
	return courseIDs
}

func processLecturer(lecturer Lecturer, courseCollection mongo.Collection) Lecturer {
	courseIDs := processCourses(lecturer.Courses, lecturer.ID, courseCollection)
	if lecturer.Ratings == nil {
		lecturer.Ratings = []primitive.ObjectID{}
	}
	lecturer.CourseIDs = courseIDs
	return lecturer
}

func processLecturers(lecturers []Lecturer, lecturerCollection mongo.Collection, courseCollection mongo.Collection) {
	var lecturerProcessed Lecturer
	for _, lecturer := range lecturers {
		lecturerProcessed = processLecturer(lecturer, courseCollection)
		res, err := lecturerCollection.InsertOne(context.TODO(), lecturerProcessed)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Inserted document with _id: %v\n", res.InsertedID)
	}
}

func main() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	mongoClient, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
		panic(err)
	}
	defer func() {
		if err = mongoClient.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	var result bson.M
	if err := mongoClient.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	lecturerCollection := mongoClient.Database("ratings").Collection("lecturers")
	courseCollection := mongoClient.Database("ratings").Collection("courses")

	r := gin.Default()
	client := &http.Client{}

	r.GET("/m/lecturers", func(c *gin.Context) {
		req, err := http.NewRequest("", "http://localhost:8080/role/lecturer/more", nil)
		req.Header.Add("X-API-KEY", "key")
		req.SetBasicAuth("admin", "password")

		if err != nil {
			panic(err)
		}

		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		var lecturers []Lecturer
		err = json.Unmarshal(body, &lecturers)
		if err != nil {
			panic(err)
		}
		processLecturers(lecturers, *lecturerCollection, *courseCollection)

		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/m/lecturer/:id", func(c *gin.Context) {
		req, err := http.NewRequest("", "http://localhost:8080/lecturer/"+c.Param("id"), nil)
		req.Header.Add("X-API-KEY", "key")
		req.SetBasicAuth("admin", "password")

		if err != nil {
			panic(err)
		}

		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		var lecturer []Lecturer

		err = json.Unmarshal(body, &lecturer)
		if err != nil {
			panic(err)
		}

		processLecturers(lecturer, *lecturerCollection, *courseCollection)

		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/u/lecturer/:id", func(c *gin.Context) {
		req, err := http.NewRequest("", "http://localhost:8080/lecturer/"+c.Param("id"), nil)
		req.Header.Add("X-API-KEY", "key")
		req.SetBasicAuth("admin", "password")

		if err != nil {
			panic(err)
		}

		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		var lecturer Lecturer

		err = json.Unmarshal(body, &lecturer)
		if err != nil {
			panic(err)
		}

		fmt.Println(lecturer)
		lecturer_id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			panic(err)
		}
		filter := bson.D{{Key: "_id", Value: lecturer_id}}

		var lecturerMongo Lecturer

		err = lecturerCollection.FindOne(context.TODO(), filter).Decode(&lecturerMongo)

		if err != nil {
			panic(err)
		}

		var courseIDs []int
		for _, course := range lecturer.Courses {
			courseIDs = append(courseIDs, course.ID)

			for _, mongoCourseID := range lecturerMongo.CourseIDs {
				if course.ID != mongoCourseID {
					var oldCourse Course
					var oldLecturer Lecturer
					courseFilter := bson.D{{Key: "_id", Value: course.ID}}
					courseCollection.FindOne(context.TODO(), courseFilter).Decode(&oldCourse)
					lecturerFilter := bson.D{{Key: "_id", Value: oldCourse.Lecturer}}
					lecturerCollection.FindOne(context.TODO(), lecturerFilter).Decode(&oldLecturer)

					oldCourse.Lecturer = lecturer_id
					oldCourse.LecturerName = lecturer.Username

					updateCourse := bson.D{
						{Key: "$set", Value: bson.D{
							{Key: "lecturerName", Value: oldCourse.LecturerName},
							{Key: "lecturer", Value: oldCourse.Lecturer},
						}},
					}
					courseCollection.UpdateOne(context.TODO(), lecturerFilter, updateCourse)

					var newCourseIDs []int
					for _, id := range oldLecturer.CourseIDs {
						if id == course.ID {
							newCourseIDs = append(newCourseIDs, course.ID)
						}
					}

					oldLecturer.CourseIDs = newCourseIDs

					updateLecturer := bson.D{
						{Key: "$set", Value: bson.D{
							{Key: "coursesTaught", Value: oldLecturer.CourseIDs},
						}},
					}

					lecturerCollection.UpdateOne(context.TODO(), courseFilter, updateLecturer)
				}
			}

			filter := bson.D{{Key: "_id", Value: course.ID}}

			update := bson.D{
				{Key: "$set", Value: bson.D{
					{Key: "title", Value: course.Title},
					{Key: "description", Value: course.Description},
					{Key: "lecturerName", Value: lecturer.Username},
					{Key: "lecturer", Value: lecturer.ID},
				}},
			}
			courseCollection.UpdateOne(context.TODO(), filter, update)
		}

		update := bson.D{
			{Key: "$set", Value: bson.D{
				{Key: "username", Value: lecturer.Username},
				{Key: "emailAddress", Value: lecturer.EmailAddress},
				{Key: "coursesTaught", Value: courseIDs},
			}},
		}

		lecturerCollection.UpdateOne(context.TODO(), filter, update)

		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/u/courses/:id", func(c *gin.Context) {
		req, err := http.NewRequest("", "http://localhost:8080/courses/"+c.Param("id")+"/less", nil)
		req.Header.Add("X-API-KEY", "key")
		req.SetBasicAuth("admin", "password")

		if err != nil {
			panic(err)
		}

		resp, err := client.Do(req)
		if err != nil {
			panic(err)
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}

		var course Course
		err = json.Unmarshal(body, &course)

		if err != nil {
			panic(err)
		}

		course_id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			panic(err)
		}
		filter := bson.D{{Key: "_id", Value: course_id}}

		update := bson.D{
			{Key: "$set", Value: bson.D{
				{Key: "title", Value: course.Title},
				{Key: "description", Value: course.Description},
			}},
		}

		courseCollection.UpdateOne(context.TODO(), filter, update)
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.Run(":8081")
}
