import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";
import { Product } from "./libs/types/product";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "session",
});

/* 1-ENTRANCE */
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/* 2-SESSIONS */
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, //6h
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/* 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 4-ROUTERS */

// routerAdmin.post("/roduct/search", (req, res) => {
//   const query = req.body.query.toLowerCase();
//   const filteredProducts = Product.filter((product: { productName: string }) =>
//     product.productName.toLowerCase().includes(query)
//   );
//   res.render("admin/products", { products: filteredProducts });
// });

// BSSR: EJS
app.use("/admin", routerAdmin); //BSSR  // Traditional Api // EJS
app.use("/", router); // SPA - React // Rest Api    // Middleware design pattern

export default app; //module.exports
