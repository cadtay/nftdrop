import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='text-red-500 text-4xl font-bold'>
        Welcome to NFT Drop Challenge</h1>
    </>
  )
}

export default Home
