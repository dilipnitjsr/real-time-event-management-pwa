import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const place = searchParams.get("place");

    if (!place) {
        return NextResponse.json({ error: "Place parameter is required" }, { status: 400 });
    }

    const apiKey = "32ebda1421d5ec8b5e922075ade9d9d3ac2ac3e2139bb74f064017b963784584";
    const url = `https://serpapi.com/search.json?q=events+in+${encodeURIComponent(place)}&location=${encodeURIComponent(place)}&engine=google_events&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        let data = await response.json();
        data = data.events_results 
        const result = data?.map((onedata:any)=>{
            return {
                title : onedata?.title,
                date : onedata?.date?.when,
                address  :onedata?.address[0],
                link  : onedata?.link,
                description : onedata?.description,
                venue : {
                    name : onedata?.venue?.name,
                    link :  onedata?.venue?.link
                },
                thumbnail  : onedata?.thumbnail , 
                image : onedata?.image
                  }
        })
        console.log(result)
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
