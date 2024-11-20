import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

// router.get("/", memberController.goHome);
// router.get("/login", memberController.getLogin);
// router.get("/signup", memberController.getSignup);

// Member
router.get("/member/restaurant", memberController.getRestaurant);

router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);

router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth, // Middleware design pattern
  uploader("members").single("memberImage"),
  memberController.updateMember
);

router.get("/member/top-users", memberController.getTopUsers);

// Product

router.get("/product/all", productController.getProducts);
// router.get("/product/all/:key/:id", productController.getProducts); params
router.get(
  "/product/:id", // id nomini ozgartiriwimiz mn
  memberController.retrieveAuth, //login bolmagan user bolsa ham keyingi mantiqqa otqazadi agar login bolgan user bolsa uning malumotlarini ham qoshib log qiladi
  productController.getProduct
);

// Order
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);

router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);
export default router;
