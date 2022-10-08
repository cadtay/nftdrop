interface Image {
    asset: {
        url: string 
    }
}

interface Slug {
    current: string
}

export interface Creator {
    _id: string,
    name: string,
    address: string,
    slug: Slug
    image: Image 
    bio: string
}

export interface Collection {
    _id: string,
    title: string,
    description: string,
    nftCollectionName: string,
    address: string,
    slug: Slug,
    creator: Creator,
    mainImage: Image,
    previewImage: Image
}