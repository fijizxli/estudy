import axios, { fileupload } from "../axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context";
import { Navigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";

export default function EditCourse() {
  const { user } = useAuth();
  const [course] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [lecturer, setLecturer] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [coverPath, setCoverPath] = useState<string>("");
  const { courseId } = useParams();

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const response = await axios.get("/courses/" + courseId, {
          headers: {
            Authorization: `Basic ${user?.auth}`,
            "Content-Type": "application/json",
          },
        });

        const lecturersResponse = await axios.get("/role/lecturer", {
          headers: {
            Authorization: `Basic ${user?.auth}`,
            "Content-Type": "application/json",
          },
        });

        setIsLoading(false);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setLecturer(response.data.lecturerName);
        setLecturers(lecturersResponse.data);
      };

      fetchData();
    }
  }, []);

  useEffect( ()=> {
      if (courseId){
          fileupload.get("/cover/"+courseId).then( response => {
              setCoverPath(response.data.url[0]);
          }
        );
      }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFile(e.target.files[0]);
        }
    };

  const handleSubmit = async (e: any) => {
    if (file != null){
        const formData = new FormData();
        formData.append('file', file);
        if (coverPath != ""){
            fileupload.put("/cover/"+courseId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        } else {
            fileupload.post("/upload/cover/"+courseId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        }
    }
    let data = JSON.stringify({
      title: title,
      description: description,
      lecturerName: lecturer,
    });

    e.preventDefault();
    try {
      await axios.patch(`/courses/${courseId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${user?.auth}`,
          Accept: "application/json",
        },
      });
      alert("Course edited.");
    } catch (error) {
      alert(error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2>loading...</h2>
      </div>
    );
  } else {
    return user?.isLoggedIn ? (
      <div className="max-w-80 m-auto pt-10">
        <Label className="text-3xl flex m-auto pt-20 pb-10 justify-center">
          <b>Edit course:</b>
        </Label>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="title">Title</Label>
          <br />
          <Input
            className=""
            type="text"
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="title"
            id="title"
            value={title}
            required
            defaultValue={course?.title}
          />
          <br />
          <Label htmlFor="lecturer">Lecturer</Label>
          <br />
          <Select value={lecturer} onValueChange={(value) => setLecturer(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={lecturer}/>
            </SelectTrigger>
            <SelectContent>
            {lecturers.map((user: User) => (
              <SelectItem key={user.id} value={user.username}>{user.username}</SelectItem>
            ))}
            </SelectContent>
          </Select>
          <br />
          <Label htmlFor="description">Description</Label>
          <br />
          <Textarea
            className="h-40"
            onChange={(e: any) => setDescription(e.target.value)}
            placeholder="Description"
            id="description"
            value={description}
            defaultValue={course?.description}
            required
          ></Textarea>
          <br />
          <div className="grid max-w-sm items-center gap-1. 5w-100 pu-0 mb-2 mu-8 inline-block radius-10 box">
            <Label htmlFor="picture">Cover</Label>
            <Input id="file" type="file" onChange={handleFileChange} />
          </div>
          <Button className="" type="button" onClick={handleSubmit}>
            Edit
          </Button>
        </form>
      </div>
    ) : (
      <Navigate replace to="/" />
    );
  }
}
