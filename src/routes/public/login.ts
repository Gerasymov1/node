import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";

export const loginRouter = Router();

loginRouter.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "john.doe",
  };

  const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
  const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  res
    .cookie("refreshToken", refreshToken)
    .header("Authorization", `Bearer ${accessToken}`)
    .send(user);
});
