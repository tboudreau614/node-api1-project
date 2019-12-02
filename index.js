// implement your API here

const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({api: "api is responsive"});
})

server.get("/api/users", (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log('The users information could not be retrieved.', error);
        res
        .status(500)
        .json({errorMessage: "The users information could not be retrieved."})
    })
})

server.post("/api/users", (req, res) => {
    const userData = req.body;
    if (!userData.name || !userData.bio) {
      res
        .status(400)
        .json({error: "Enter a name and bio for this user." });
    } else {
      db
        .insert(userData)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.json({error: "The user was not added" });
        });
    }
  });

  server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db
      .findById(id)
      .then(user => {
        if (!user) {
          res
            .status(404)
            .json({error: "That user id doesn't exist on this server."});
        } else {
          res.json(user);
        }
      })
      .catch(error => {
        res.status(400)
        .json({error: "This user description is not available."});
      });
  });

  server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db
    .findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({error: "That user ID doesn't exist on this server."});
      } else {
        db
          .remove(id)
          .then(user => {
            res.status(201).json(user);
          })
          .catch(error => {
            res.status(500).json({error: "There was an error deleting the user."});
          });
      }
    });
  });

  server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const modify = req.body;
    db.findById(id).then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "That user ID doesn't exist on this server."});
      } else if (!modify.name || !modify.bio) {
        res
          .status(400)
          .json({ error: "Please enter a user name and bio."});
      } else {
        db
          .update(id, modify)
          .then(user => {
            res.status(200).json(user);
          })
          .catch(error => {
            res.status(500).json({ message: "That user was not modified!"});
          });
      }
    });
  });

const port = 4050;
server.listen(port, () => 
    console.log(`api running on port ${port}`)
);