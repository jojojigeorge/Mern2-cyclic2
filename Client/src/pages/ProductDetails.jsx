import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [similarproducts,setSimilarProducts]=useState([])
  const params = useParams();

  // get similar products
  const getSimilarProducts=async(pid,cid)=>{
    try {
      const {data}=await axios.get(`/api/v1/product/similar-product/${pid}/${cid}`)
      console.log(data)
      setSimilarProducts(data.similarproducts)
    } catch (error) {
      console.log('error in get similar products',error)
    }
  } 

  // get selected product details
  const getProductDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-productdetails/${params.slug}`);
      console.log(data.singleproduct);
      setProduct(data.singleproduct);
      getSimilarProducts(data.singleproduct._id,data.singleproduct.category._id)
    } catch (error) {
      console.log("Error in get selected product details", error);
    }
  };

  // at start lading page
  useEffect(() => {
    if (params.slug) getProductDetails();
  }, [params.slug]); 

  return (
    <>
      <Layout>  
        <div className="row container mt-3">    
          <div className="col-md-6  "> 
            <img className="ms-5" src={`http://localhost:8081/api/v1/product/getproduct-photo/${product._id}`} height={300} width={"350px"} alt="photo" />
          </div>
          <div className="col-md-6 ">
            <h1 className="text-center">Product Details</h1>
            <p><strong className="">Name :</strong> {product.name}</p>
            <p><strong>Description :</strong> {product.description}</p>
            <p><strong>Price :</strong> {product.price}</p>
            <p><strong>Category : </strong>{product?.category?.category}</p>
            <button className="btn btn-secondary ms-1">ADD TO CART</button>
          </div>
        </div>    
        <hr />
        {/* show similar products */}
        <div><h5 className=" container">Similar Products</h5></div>
        <div className="d-flex container flex-wrap">
            {similarproducts?similarproducts.map((p) => (
              <div key={p._id} className="card m-2" style={{ width: "11rem", height:""}}>
                <Link to={`/product/${p.slug}`} className="product-link">
                <img
                  src={`http://localhost:8081/api/v1/product/getproduct-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}  
                  style={{height:"11rem"}}  
                />  
                <div className="card-body text-center"> 
                  <h6 className="card-title">{p.name.substring(0, 14)}...</h6>
                  {/* <p className="card-text">
                    {p.description.substring(0, 30)}... 
                  </p> */}  
                  <p className="card-text"> ₹ {p.price}</p>
                  {/* <button className="btn btn-primary ms-1">More Details</button> */}
                  <button className="btn btn-secondary mt-1">ADD TO CART</button>
                </div>  
              </Link>
              </div>
            )):<h4>No similar products</h4>}
            </div>
      </Layout>
    </>
  );
};

export default ProductDetails;
