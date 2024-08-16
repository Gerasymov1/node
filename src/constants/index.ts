import dotenv from "dotenv";
import { User } from "../types";

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const MOCKED_USERS: User[] = [
  {
    id: 1,
    username: "john doe",
    displayName: "John Doe",
  },
  {
    id: 2,
    username: "jane doe",
    displayName: "Jane Doe",
  },
  {
    id: 3,
    username: "john smith",
    displayName: "John Smith",
  },
  {
    id: 4,
    username: "jane smith",
    displayName: "Jane Smith",
  },
  {
    id: 5,
    username: "john wick",
    displayName: "John Wick",
  },
  {
    id: 6,
    username: "jane wick",
    displayName: "Jane Wick",
  },
  {
    id: 7,
    username: "john snow",
    displayName: "John Snow",
  },
  {
    id: 8,
    username: "jane snow",
    displayName: "Jane Snow",
  },
  {
    id: 9,
    username: "john cena",
    displayName: "John Cena",
  },
  {
    id: 10,
    username: "jane cena",
    displayName: "Jane Cena",
  },
];
