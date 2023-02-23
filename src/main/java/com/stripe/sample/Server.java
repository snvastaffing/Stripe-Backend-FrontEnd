package com.stripe.sample;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.model.Price;
import com.stripe.model.PriceCollection;
import com.stripe.model.Product;
import com.stripe.model.ProductCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import spark.Filter;

import static spark.Spark.*;

public class Server {

  public static void main(String[] args) {
    port(4242);

    // This is a public sample test API key.
    // Don’t submit any personally identifiable information in requests made with this key.
    // Sign in to see your own test API key embedded in code samples.
    Stripe.apiKey = "  to be added after the pull and make your own stripe test account and then use the key here ";

    staticFiles.externalLocation(
        Paths.get("public").toAbsolutePath().toString());


    after((Filter) (requset,response)->{
      response.header("Access-Control-Allow-Origin","*");
      response.header("Access-Control-Allow-Methods","GET");
    });

    post("/create-checkout-session", (request, response) -> {
        String YOUR_DOMAIN = "http://localhost:4242";
        SessionCreateParams params =
          SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(YOUR_DOMAIN + "?success=true")
            .setCancelUrl(YOUR_DOMAIN + "?canceled=true")
            .addLineItem(
              SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                .setPrice("price_1MeiyrSHFKxz9m7TYqAG8FaL")
                .build())
            .build();
      Session session = Session.create(params);

      response.redirect(session.getUrl(), 303);
      return "";
    });



    get("/products",((request, response) -> {

      Map<String, Object> params = new HashMap<>();


      ProductCollection products = Product.list(params);


    response.type("application/json");
      return new Gson().toJson(products) ;
    }));


    get("/price",((request, response) -> {

      Map<String ,Object> params = new HashMap<>();
         PriceCollection prices= Price.list(params);

      response.type("application/json");
      return new Gson().toJson(prices) ;
    }));



  }
}