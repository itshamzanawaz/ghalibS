import React, { useState } from 'react'
import Link from 'next/link';
import { useQuery,gql } from '@apollo/client';
// Import Apollo Client

// Create a client instance

import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api-ap-south-1.hygraph.com/v2/clsz0l8t2000008ij58dh7p1v/master',
  cache: new InMemoryCache(),
});

// Define your query
const MY_QUERY = gql`
  query MyQuery {
    banners {
      image {
        url
      }
      largeText
      midText
      desc
      id
      buttonText
    }
  }
`

const HeroBanner = () => {

  const { loading, error, data } = useQuery(MY_QUERY, { client });
  if (loading) {
    return <>loading</>
  }
  const heroBanner = data?.banners[0]

  return (
    <div className="hero-banner-container">
      <div>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText}</h1>
        <img
          src={heroBanner.image.url}
          alt="headphones"
          className="hero-banner-image"
        />

        <div>
          <Link href={`/products/unisex-long-sleeve-tee?variant=ckko4xzig0fxy0a54t9dpocrj`}>
            <button type="button">{heroBanner.buttonText}</button>
          </Link>
          <div className="desc">
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
