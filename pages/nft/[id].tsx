import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react"
import { useDropTotalClaimedSupply } from "@thirdweb-dev/react/solana";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import { url } from 'inspector';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
    collection: Collection
}

function NFTDropPage({ collection }: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [priceInEth, setPriceInEth] = useState<string>()
    const nftDrop = useNFTDrop(collection.address);

    const connectWithMetaMask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();


    useEffect(() => {
        if (!nftDrop) return;

        const fetchPrice = async ()  => {
            const claimConditions = await nftDrop.claimConditions.getAll();
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
        }

        fetchPrice();

    },[nftDrop])

    useEffect(() => {
        if (!nftDrop) return

        const fetchNFTDropData = async () => {
            setLoading(true);

            const claimed = await nftDrop.getAllClaimed();
            const total = await nftDrop.totalSupply();

            setClaimedSupply(claimed.length)
            setTotalSupply(total)

            setLoading(false);
        }

        fetchNFTDropData()
    }, [nftDrop])

    const mintNft = () => {
        if(!nftDrop || !address) return;

        const quantity = 1;

        setLoading(true);
        const notification = toast.loading('Minting NFT...', {
        style: {
            background: 'white',
            color: 'green',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px'
        }})

        nftDrop.claimTo(address, quantity).then(async (resp) => {
            const receipt = resp[0].receipt;
            const claimedToken = await resp[0].data();
            const claimedNFT= resp[0].id;

            toast('Successfully minted', {
                style: {
                    background: 'green',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px'
                }
            })

            const claimed = await nftDrop.getAllClaimed();
            setClaimedSupply(claimed.length);
        }).catch(err => {
            toast('Whoops.... Something went wrong', {
                style: {
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px'
                }
            })
        }).finally(() => {
            setLoading(false);
            toast.dismiss(notification)
        })
    }

  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        <Toaster position='bottom-center'/>
        {/* Left */}
        <div className='bg-gradient-to-br from-cyan-800 
        to-rose-500 lg:col-span-4'>
            <div className='flex flex-col items-center justify-center
            py-2 lg:min-h-screen'>
                <div className='bg-gradient-to-br 
                from-yellow-400 to-purple-600 p-2 rounded-xl'>
                    <img 
                        className='w-44 rounded-xl object-cover
                        lg:h-96 lg:w-72' 
                        src={urlFor(collection.previewImage).url()} 
                        alt=''
                    />
                </div>   
                <div className='text-center p-5 space-y-2'>
                    <h1 className='text-4xl font-bold text-white'>
                        {collection.nftCollectionName}
                    </h1>
                    <h2 className='text-xl text-gray-300'>
                        {collection.description}
                    </h2>
                </div>
            </div>
        </div> 

        {/* Right */}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>   
            {/* Header */}
            <header className='flex items-center justify-between'>
                <Link href={'/'}>
                    <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>
                        The {' '}
                        <span className='font-extrabold underline decoration-pink-600/50'> 
                        PAPAFAM 
                        </span>{' '}
                        NFT Market Place
                    </h1>
                </Link>

                <button 
                className='rounded-full bg-rose-400 text-white px-4 py-2 text-xs 
                font-bold lg:px-5 lg:py-2 lg:text-base'
                onClick={() => {address ? disconnect() : connectWithMetaMask()}}
                >
                    {address ? 'Sign out' : 'Sign in'}
                </button>
            </header>

            <hr className='my-2 border'/>
            {address && (
                <p className='text-center text-sm text-rose-400'>
                    You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}
                </p>
            )}

            {/* Content */ }
            <div className=' mt-10 flex flex-1 flex-col items-center space-y-6 text-center
            lg:space-y-0 lg:justify-center'>
                <img
                    className='w-80 object-cover pb-10 lg:h-40' 
                    src={urlFor(collection.mainImage).url()} 
                    alt=''
                />

                <h1 className='text-3xl font-bold lg:text-4xl lg:font-extrabold'>
                    {collection.title}
                </h1>
                {isLoading ? (
                    <p className='pt-2 text-xl text-green-500 animate-pulse'>Loading Supply Count...</p>
                ) : (
                    <p className='pt-2 text-xl text-green-500'>{claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
                )}
                {isLoading && (
                    <img className='h-80 w-80 object-contain' 
                    src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif' 
                    alt=''/>
                )} 
            </div>

            {/* Mint Button */}
            <button 
            onClick={() => mintNft()}
            disabled={
                isLoading 
                || claimedSupply === totalSupply?.toNumber() 
                || !address}
            className='h-16 bg-red-600 text-white rounded-full w-full mt-10 
            font-bold text-white disabled:bg-gray-400'>
                {isLoading ? (
                    <>Loading</>
                ): claimedSupply === totalSupply?.toNumber() ? (
                    <>SOLD OUT</>
                ): !address ? (
                    <>Sign in to mint</>
                ): (
                    <span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
                )}
            </button>
        </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
        asset
      },
      previewImage {
        asset
      },
      slug {
        current
      },
      creator-> {
        _id,
          name,
          address,
        slug {
          current
        },
      },
    }`

    const collection = await sanityClient.fetch(query, {
        id: params?.id
    })

    if(!collection) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            collection
        }
    }
}