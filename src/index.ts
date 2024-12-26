import express from "express";
import { Client } from "pg";
import { dbURL } from "./config";

const client = new Client(dbURL)

const app = express();

app.use(express.json())

app.get("/", (req,res)=>{
    res.json("API is working")
})

interface TravelPlan {
    id: number;
    title: string;
    destination_city: string;
    destination_country: string;
    start_date: string;
    end_date: string;
    budget: number;
  }

(async()=>{
 await client.connect();
})();


app.post("/api/v1/createPlan", async (req,res)=>{
    
    const user_id = req.body.user_id;
    const title= req.body.title;
    const destination_city= req.body.destination_city;
    const destination_country = req.body.destination_country;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const budget = req.body.budget;

    try {
        const query= "INSERT INTO travel_plans (user_id, title, destination_city, destination_country, start_date, end_date, budget) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        const values = [user_id, title, destination_city, destination_country, start_date, end_date, budget]

        const createData = await client.query(query,values)
        res.json({
            createData,
            message: "Successfull created"
        })
    } catch (error) {
        console.log(error)
        res.json(error)
    }

})

interface UpdatePlan{
    planId: number,
    title: string,
    budget: number
}
app.put("/api/v1/updatePlan", async (req,res)=>{
    const {planId, title,budget } = req.body;
    const query = "UPDATE travel_plans SET title= $1, budget= $2 WHERE id=$3"
    const values = [title, budget, planId]
    const updatePlan = await client.query(query, values)
    res.json({updatePlan})
})

app.get("/api/v1/fetchData", async(req,res)=>{
    const id = req.body.id;
    const query = "SELECT * FROM travel_plans WHERE id=$1"
    const response = await client.query(query,[id]);
    res.json({response: response.rows})
    console.log(response.rows)

})
app.listen(3000,()=>{
    console.log("API is working 3000 PORT")
})