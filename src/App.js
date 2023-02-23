import React, { useState, useEffect } from "react";
import "./App.css";

const Price = (props) => {
  const [prices, setPrices] = useState()

  const getPrice = () => {

    const filtered = prices.filter(
      x => x.id == props.id
    )
    console.log("The Type", typeof filtered)

    return filtered
  }
  useEffect(() => {
    var raw = "";

    var requestOptions = {
      method: 'GET'
    };


    fetch(`http://localhost:4242/price`, requestOptions)
      .then(response => response.json())
      .then(result => {

        setPrices(result.data)
        console.log("The Data " + JSON.stringify(prices))
      })
      .catch(error => console.log('error', error));
    console.log("The Prices", prices)
  }, [])

  

  return (
    <>
      {prices?<>
        {getPrice()[0].unit_amount}
      </>:<> .... Loading</>}

      </>
  )
}

const ProductDisplay = (props) => {
  const [products, setProducts] = useState()
  useEffect(() => {
    /// products 
    var raw = "";

    var requestOptions = {
      method: 'GET'
    };

    fetch("http://localhost:4242/products", requestOptions)
      .then(response => response.json())
      .then(result => {
        setProducts(result.data)
        console.log("The Produts Api ", result.data)
      })
      .catch(error => console.log('error', error));
    // prices 
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };




  }, [])


  return (
    <>
      {
        products?.length > 0 ?
          products.map((item, index) => {
            return (
              <section key={index}>
                <div className="product">
                  <img
                    src={item.images[0]}
                    alt="The cover of Stubborn Attachments"
                  />
                  <div className="description">
                    <h3>{item.name}</h3>
                    <h5><Price id={item.default_price.id}></Price></h5>
                  </div>
                </div>
                <form action="/create-checkout-session" method="POST">
                  <button type="submit">
                    Checkout
                  </button>
                </form>
              </section>)
          })

          : <>
            .... Loading</>
      }

    </>
  )



}

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState({})

  useEffect(() => {


    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay products={products} />
  );
}