import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from './page/home/HomePage';
import LoginPage from "./page/auth/login/LoginPage";
import ForgetPassword from "./page/auth/forgetpassword/ForgetPassword";
import ClientLayout from "./layout/ClientLayout/ClientLayout";
import AdminLayout from "./layout/AdminLayout/AdminLayout";
import Dashboard from "./page/dashboard/Dashboard";
import RegisterPage from "./page/auth/register/RegisterPage";
import ContactPage from "./page/contact/ContactPage";
import BlogPage from "./page/blog/BlogPage";

import { CategoryAdd, CategoryList, CategoryUpdate } from "./feature/category";
import { BrandAdd, BrandList, BrandUpdate } from "./feature/brand";
import { ProductAdd, ProductList, ProductUpdate } from "./feature/product";
import { UserAdd, UserList, UserUpdate } from "./feature/user";
import { RoleAdd, RoleList, RoleUpdate } from "./feature/role";
import NotFoundPage from "./page/notFoundPage/NotFoundPage";
import { ColorAdd, ColorList, ColorUpdate } from "./feature/color";
import { SizeAdd, SizeList, SizeUpdate } from "./feature/size";
import { BillList, BillUpdate } from "./feature/bill";
import Statistic from "./feature/statistic/Statistic";
import AboutPage from "./page/about/AboutPage";
import CartPage from "./page/cart/CartPage";
import CheckoutPage from "./page/checkout/CheckoutPage";
import BlogDetailPage from "./page/blog/BlogDetailPage";
import { VariantProductAdd, VariantProductUpdate } from "./feature/product/variantProduct";
import AccountPage from "./page/account/AcccountPage";
import InfoUser from "./page/account/components/InfoUse";
import { CouponList } from "./feature/counpon";
import CouponAdd from "./feature/counpon/CouponAdd/CounponAdd";
import CouponUpdate from "./feature/counpon/CouponUpdate/CouponUpdate";
import Favorite from "./page/account/components/Favorite";
import VerifyToken from "./page/auth/VerifyToken/VerifyToken";
import ChangePasswordForget from "./page/auth/ChangePasswordForget/ChangePasswordForget";
import ChangePasswordNew from "./page/auth/ChangePasswordNew/ChangePasswordNew";
import AuthGuard from "./util/authGuard";
import PrivateRoute from "./util/privateRouter";
import ListProductDelete from "./feature/product/ProductList/components/ListProductDelete";
import VoucherPage from "./page/account/components/Voucher";
import DashboardAccount from "./page/account/components/DashBoard";
import DashboardBill from "./page/account/components/bill/billList";
import BillDetail from "./page/account/components/bill/BillDetail";
import VerifyEmail from "./page/auth/register/VerifyEmail";
import SearchPage from "./page/search/SearchPage";

import { BannerList, BannerUpdate } from "./feature/banner";
import { ReviewList } from "./feature/review";
import ProductByBrand from "./page/brand/ProductByBrand";
import ProductByCategory from "./page/category/ProductByCategory";
import NewsList from "./feature/news/NewsList/NewsList";
import NewsAdd from "./feature/news/NewsAdd/NewsAdd";
import NewsUpdate from "./feature/news/NewsUpdate/NewsUpdate";
import { AddGroup, UpdateGroup, ListGroup } from "./feature/group";
import ListReviews from "./page/account/components/ListReviews";
import PrivateRouterLogin from "./util/privateRouterLogin";
import { ProductDetailPage, ProductPage } from "./page/product";
import MemberLayout from "./layout/MemberLayout/MemberLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "products",
        children: [
          { index: true, element: <ProductPage /> },
          { path: ":id", element: <ProductDetailPage /> },
          { path: "add", element: <ProductAdd /> },
        ],
      },
      {
        path: "carts",
        element: <PrivateRouterLogin isAuth={true} />,
        children: [{ index: true, element: <CartPage /> }],
      },
      {
        path: "checkouts",
        element: <PrivateRouterLogin isAuth={true} />,
        children: [{ index: true, element: <CheckoutPage /> }],
      },
      { path: "change-password-forget", element: <VerifyToken /> },
      { path: "forget-password", element: <ForgetPassword /> },
      {
        path: "account",
        element: <AccountPage />,
        children: [
          { index: true, element: <Navigate to="info" /> },
          { path: "dashboard", element: <DashboardAccount /> },
          { path: "forget-password", element: <ForgetPassword /> },
          { path: "change-password-new", element: <ChangePasswordNew /> },
          { path: "verify-token", element: <VerifyToken /> },
          { path: "change-password-forget", element: <VerifyToken /> },
          {
            path: "bills",
            children: [
              { index: true, element: <DashboardBill /> },
              { path: ":idBill", element: <BillDetail /> },
            ],
          },
          { path: "favorites", element: <Favorite /> },
          { path: "vouchers", element: <VoucherPage /> },
          { path: "reviews", element: <ListReviews /> },
          {
            path: "info",
            children: [
              { index: true, element: <InfoUser /> },
              { path: "changPassword", element: <h2>ChanglePassWord</h2> },
            ],
          },
        ],
      },
      {
        path: "forget-password",
        children: [{ index: true, element: <ForgetPassword /> }],
      },
      {
        path: "verify-token",
        children: [{ index: true, element: <VerifyToken /> }],
      },
      {
        path: "changepasswordforget",
        children: [{ index: true, element: <ChangePasswordForget /> }],
      },
      // {
      //   path: "changepasswordnew",
      //   children: [{ index: true, element: <ChangePasswordNew /> }],
      // },
      { path: "contact", element: <ContactPage /> },
      {
        path: "blog",
        children: [
          { index: true, element: <BlogPage /> },
          { path: ":id", element: <BlogDetailPage /> },
        ],
      },
      { path: "about", element: <AboutPage /> },
      { path: "search", element: <SearchPage /> },
      {
        path: "brands/:id",
        element: <ProductByBrand />,
      },
      { path: "categories/:id", element: <ProductByCategory /> },
    ],
  },
  {
    path: "register",
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
      { path: "verify-email", element: <VerifyEmail /> },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  { path: "checkAdmin", element: <AuthGuard /> },
  {
    path: "admin",
    element: <PrivateRoute isAuth={true} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" /> },
          { path: "dashboard", element: <Dashboard /> },
          {
            path: "products",
            children: [
              { index: true, element: <ProductList /> },
              { path: "add", element: <ProductAdd /> },
              { path: "listDelete", element: <ListProductDelete /> },
              { path: ":id/update", element: <ProductUpdate /> },
              { path: ":id/variant/add", element: <VariantProductAdd /> },
              {
                path: ":id/variant/:variantID/update",
                element: <VariantProductUpdate />,
              },
            ],
          },
          {
            path: "categories",
            children: [
              { index: true, element: <CategoryList /> },
              { path: "add", element: <CategoryAdd /> },
              { path: ":id/update", element: <CategoryUpdate /> },
            ],
          },
          {
            path: "brands",
            children: [
              { index: true, element: <BrandList /> },
              { path: "add", element: <BrandAdd /> },
              { path: ":id/update", element: <BrandUpdate /> },
            ],
          },
          {
            path: "news",
            children: [
              { index: true, element: <NewsList /> },
              { path: "add", element: <NewsAdd /> },
              { path: ":id/update", element: <NewsUpdate /> },
            ],
          },
          {
            path: "coupons",
            children: [
              { index: true, element: <CouponList /> },
              { path: "add", element: <CouponAdd /> },
              { path: ":id/update", element: <CouponUpdate /> },
            ],
          },
          {
            path: "colors",
            children: [
              { index: true, element: <ColorList /> },
              { path: "add", element: <ColorAdd /> },
              { path: ":id/update", element: <ColorUpdate /> },
            ],
          },
          {
            path: "sizes",
            children: [
              { index: true, element: <SizeList /> },
              { path: "add", element: <SizeAdd /> },
              { path: ":id/update", element: <SizeUpdate /> },
            ],
          },
          {
            path: "users",
            children: [
              { index: true, element: <UserList /> },
              { path: "add", element: <UserAdd /> },
              { path: ":id/update", element: <UserUpdate /> },
            ],
          },
          {
            path: "roles",
            children: [
              { index: true, element: <RoleList /> },
              { path: "add", element: <RoleAdd /> },
              { path: ":id/update", element: <RoleUpdate /> },
            ],
          },
          {
            path: "product-group",
            children: [
              { index: true, element: <ListGroup /> },
              { path: "add", element: <AddGroup /> },
              { path: ":id/update", element: <UpdateGroup /> },
            ],
          },
          {
            path: "banners",
            children: [
              { index: true, element: <BannerList /> },
              { path: ":id/update", element: <BannerUpdate /> },
            ],
          },
          {
            path: "bills",
            children: [
              { index: true, element: <BillList /> },
              { path: ":id/update", element: <BillUpdate /> },
            ],
          },
          { path: "reviews", element: <ReviewList /> },
          { path: "statistics", element: <Statistic /> },
        ],
      },
    ],
  },
  {
    path: "member",
    element: <PrivateRoute isAuth={true} />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          { index: true, element: <Navigate to="bills" /> },
          {
            path: "bills",
            children: [
              { index: true, element: <BillList /> },
              { path: ":id/update", element: <BillUpdate /> },
            ],
          },
          {
            path: "products",
            children: [
              { index: true, element: <ProductList /> },
              { path: "add", element: <ProductAdd /> },
              { path: "listDelete", element: <ListProductDelete /> },
              { path: ":id/update", element: <ProductUpdate /> },
              { path: ":id/variant/add", element: <VariantProductAdd /> },
              {
                path: ":id/variant/:variantID/update",
                element: <VariantProductUpdate />,
              },
            ],
          },
          {
            path: "categories",
            children: [
              { index: true, element: <CategoryList /> },
              { path: "add", element: <CategoryAdd /> },
              { path: ":id/update", element: <CategoryUpdate /> },
            ],
          },
          {
            path: "brands",
            children: [
              { index: true, element: <BrandList /> },
              { path: "add", element: <BrandAdd /> },
              { path: ":id/update", element: <BrandUpdate /> },
            ],
          },
          {
            path: "news",
            children: [
              { index: true, element: <NewsList /> },
              { path: "add", element: <NewsAdd /> },
              { path: ":id/update", element: <NewsUpdate /> },
            ],
          },
          {
            path: "colors",
            children: [
              { index: true, element: <ColorList /> },
              { path: "add", element: <ColorAdd /> },
              { path: ":id/update", element: <ColorUpdate /> },
            ],
          },
          {
            path: "sizes",
            children: [
              { index: true, element: <SizeList /> },
              { path: "add", element: <SizeAdd /> },
              { path: ":id/update", element: <SizeUpdate /> },
            ],
          },
          {
            path: "product-group",
            children: [
              { index: true, element: <ListGroup /> },
              { path: "add", element: <AddGroup /> },
              { path: ":id/update", element: <UpdateGroup /> },
            ],
          },
          {
            path: "banners",
            children: [
              { index: true, element: <BannerList /> },
              { path: ":id/update", element: <BannerUpdate /> },
            ],
          },

          { path: "reviews", element: <ReviewList /> },
          { path: "statistics", element: <Statistic /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
