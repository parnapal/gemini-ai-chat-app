let express = require('express');
let app = express();
let port = process.env.PORT || 8000;

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


let cors = require('cors');
app.use(cors()); 
app.use(express.json());

require("dotenv").config();



let {GoogleGenerativeAI} = require('@google/generative-ai');
let genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);


let model = genAI.getGenerativeModel({model: 'gemini-2.5-flash'}); 

app.post('/api/ask', async (req, res) => {
    try {
        const { message } = req.body || {};
        if (!message) {
            return res.status(400).json({ error: 'message field is required' });
        }

        const candidates = [
                            "gemini-2.5-pro",
                            "gemini-2.5-flash-lite",
                            "gemini-flash-latest",
                            "gemini-2.0-flash",
                        ];

        for (const name of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: name });
                const result = await model.generateContent(message);

                const response = await result.response;
                const finalResponse =  response.text();

                // console.log("OK:", name, "->", result.response.text());
                console.log("OK:", name);

                res.json({ status: true, reply: finalResponse });

                break;
            } catch (e) {
                console.log("FAIL:", name, "-", e.status || e.message);
            }
        }
        
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


