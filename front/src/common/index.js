const backapi = "http://localhost:8000";

const Allapi = {
  signup: {
    url: `${backapi}/api/signup`,
    method: "post",
  },
  signin: {
    url: `${backapi}/api/login`,
    method: "post",
  },
  userdet: {
    url: `${backapi}/api/user/details/`,
    method: "get",
  },
  logout: {
    url: `${backapi}/api/logout`,
    method: "get",
  },
  allusers: {
    url: `${backapi}/api/all-users`,
    method: "get",
  },
  changerole: {
    url: `${backapi}/api/changerole`,
    method: "post",
  },
  uploadproduct: {
    url: `${backapi}/api/productupload`,
    method: "post",
  },
  allproducts: {
    url: `${backapi}/api/allproducts`,
    method: "get",
  },
  editproduct: {
    url: `${backapi}/api/editproduct`,
    method: "post",
  },
  getcatproduct: {
    url: `${backapi}/api/getcatproducts`,
    method: "post",
  },
  deleteproduct: {
    url: `${backapi}/api/deleteproduct`,
    method: "get",
  },
  categorywise: {
    url: `${backapi}/api/get_category`,
    method: "post",
  },
  prod_det: {
    url: `${backapi}/api/prod_det`,
    method: "post",
  },
};
export default Allapi;
