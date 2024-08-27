import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY } from "../../constants";
import { UserDB } from "../../types";
import { db } from "../../settings/db";

export const authRouter = Router();

authRouter.post("/api/login", (req, res) => {
  const { firstName, lastName, password } = req.body;

  if (!firstName || !lastName || !password) {
    return res.status(400).send("Invalid request, fill in all fields");
  }

  const query = "SELECT * FROM users WHERE firstName = ? AND lastName = ?;";

  db.query(query, [firstName, lastName], (err, result) => {
    if (err) {
      return res.status(500).send("Error checking if user exists");
    }

    if ((result as []).length === 0) {
      return res.status(404).send("User not found");
    }

    const user = (result as [UserDB])[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("Error comparing passwords");
      }

      if (!result) {
        return res.status(401).send("Invalid password or first name/last name");
      }

      const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
      const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });

      console.log("accessToken:", accessToken);
      console.log("refreshToken:", refreshToken);

      res
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .send(user);
    });
  });
});

authRouter.post("/api/registration", async (req, res) => {
  const { firstName, lastName } = req.body;

  const checkIfUserExistsFirstNameAndLastName = `SELECT * FROM users WHERE firstName = ? AND lastName = ?;`;

  db.query(
    checkIfUserExistsFirstNameAndLastName,
    [firstName, lastName],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error checking if user exists");
      }

      if ((result as []).length > 0) {
        return res.status(409).send("User already exists");
      }

      const salt = 10;

      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return res.status(500).send("Error hashing password");
        }

        const user = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: hash,
        };

        const query = "INSERT INTO users SET ?";

        db.query(query, user, (err, result) => {
          if (err) {
            return res.status(500).send("Error inserting user");
          }

          const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
          const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });

          console.log("accessToken:", accessToken);
          console.log("refreshToken:", refreshToken);

          res
            .cookie("refreshToken", refreshToken)
            .cookie("accessToken", accessToken)
            .send(user);
        });
      });
    }
  );
});
