import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /review
app.post("/review", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }
    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast model, you can swap for 70B
        messages: [
          { role: "system", 
            content: `You are an expert software engineer and code reviewer.
                      Your task is to carefully analyze user-submitted code and provide constructive, actionable feedback.

                      When reviewing code:
                      1. Point out issues related to:
                        - Readability
                        - Efficiency / performance
                        - Maintainability
                        - Security (if relevant)
                        - Best practices for the given language/framework
                      2. Suggest improvements in a clear, structured way:
                        - Use bullet points for comments
                        - Keep explanations concise but insightful
                        - Avoid unnecessary changes
                      3. After listing suggestions, provide an improved version of the code.
                        - Keep the logic the same unless a bug is found
                        - Use modern and idiomatic practices
                        - Comment on major changes if needed
                      4. If the code looks good, acknowledge it and explain why it’s solid.

                      Format output as:
                      - **Review Comments:** (3 bullet points max)
                      - **Improved Code:** (full improved version)` },


          { role: "user", content: code },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(500).json({ error: "Groq API call failed" });
    }

    const data = await groqRes.json();
    const reviewed = data.choices[0].message.content; //reviewed is the string to send back 

   
    res.json({ reviewed }); // Send back in simplified JSON

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

});

// Post Describe
app.post("/describe", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }
    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast model, you can swap for 70B
        messages: [
          { role: "system", 
            content: `You are an expert software engineer and teacher.
                      Your job is to carefully scan user-submitted code,
                      then explain the user-submitted code in plain, simple English.

                      When explaining code:
                      1. Break down the code step by step, following the flow of execution.
                      2. Use clear, beginner-friendly language (avoid jargon unless explained).
                      3. Describe:
                        - What each part of the code does
                        - How the parts work together
                        - The overall purpose of the code
                      4. If helpful, include short examples of input → output.
                      5. Format the explanation in a way that is easy to scan:
                        - Use bullet points for structure
                        - Keep sentences short and clear
                      6. At the end, summarize the “big picture” of what the code achieves.
                      7. If the code is very complex, provide a simplified analogy to help understanding.

                      Format output as:
                      - **Summary:** (high-level purpose of the code ONLY no analogy)
                      -**Step-by-Step Explanation:** (high level breakdown)` },





          { role: "user", content: code },
        ],
      }),
   });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(500).json({ error: "Groq API call failed" });
    }

    const data = await groqRes.json();
    const describe = data.choices[0].message.content; //reviewed is the string to send back 

   
    res.json({ describe }); // Send back in simplified JSON

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

});


//POST Clean
app.post("/clean", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }
    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast model, you can swap for 70B
        messages: [
          { role: "system", 
            content: `You are an expert software engineer.
                      Your job is to take user-submitted code (which may be messy, experimental, or unclear) 
                      and restructure it into clean, professional, and easy-to-follow code.

                      When refactoring:
                      1. Keep the original logic and behavior the same.
                      2. Improve:
                        - Readability (clear structure, proper naming, consistent style)
                        - Maintainability (remove repetition, modularize where helpful)
                        - Professional standards (idiomatic usage for the given language/framework)
                      3. If the code is overly complex, simplify the flow without changing outcomes.
                      4. Add short inline comments only where they increase clarity (not everywhere).
                      5. Ensure formatting and indentation are consistent.
                      6. Do not over-engineer; keep it practical and clean.

                      Format output as:
                      - **Restructured Code:** (full cleaned version NO COMMENTS)
                      - **Key Improvements:** (3 bullet points max explaining major changes)` },







          { role: "user", content: code },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(500).json({ error: "Groq API call failed" });
    }

    const data = await groqRes.json();
    const clean = data.choices[0].message.content; //reviewed is the string to send back 

   
    res.json({ clean }); // Send back in simplified JSON

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

});


//POST debugger
app.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }
    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast model, you can swap for 70B
        messages: [
          { role: "system", 
            content: `You are an expert software engineer and debugger.
                      Your job is to carefully scan user-submitted code, identify errors or potential bugs,
                      and provide fixed, working code.

                      When debugging:
                      1. First, read the entire code as if you are executing it step by step.
                      2. Detect:
                        - Syntax errors
                        - Runtime errors
                        - Logical errors
                        - Edge case issues (if obvious)
                      3. List every issue clearly:
                        - Mention the **line number or section** (if possible)
                        - Explain what the issue is
                        - Explain why it causes problems
                      4. Provide a corrected version of the code that runs without errors.
                      5. Do not change logic unless the bug requires it.
                      6. Keep explanations concise but clear.

                      Format output as:
                      - **Issues Found:** (bullet points with line refs + explanation)
                      - **Fixed Code:** (clean working version)
                      - **Notes:** (if any assumptions or limitations had to be made) ` },

          { role: "user", content: code },
        ],
      }),
    });


    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(500).json({ error: "Groq API call failed" });
    }

    const data = await groqRes.json();
    const debug = data.choices[0].message.content; //reviewed is the string to send back 

   
    res.json({ debug }); // Send back in simplified JSON

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

});

//"/foodreview"
app.post("/foodreview", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }
    // Call Groq API
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // fast model, you can swap for 70B
        messages: [
          { role: "system", 
            content: `“You are a professional chef and nutritionist. Your goal is to help the user cook delicious, low-calorie, high-protein meals.

                      User requests can be:

                      A recipe (list of ingredients + instructions)

                      A cooking tip (flavor enhancement, technique, or healthier alternative)

                      Always:

                      Keep calories as low as possible

                      Maximize protein content

                      Suggest realistic, easy-to-find ingredients

                      Make food taste great

                      When giving a recipe, respond with:

                      Ingredients (with protein/cals info if possible)

                      Step-by-step cooking instructions

                      Estimated calories and protein per serving

                      When giving a cooking tip, respond with:

                      Tip or technique

                      Optional small ingredient swap to improve nutrition or flavor ` },

          { role: "user", content: code },
        ],
      }),
    });


    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(500).json({ error: "Groq API call failed" });
    }

    const data = await groqRes.json();
    const reviewed = data.choices[0].message.content; //reviewed is the string to send back 

   
    res.json({ reviewed }); // Send back in simplified JSON

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

});










//get requests
app.use("/", express.static(path.join(__dirname, "CodeHelperDist")));

// Fallback: always return index.html for SPA routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "CodeHelperDist", "index.html"));
});






// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});





