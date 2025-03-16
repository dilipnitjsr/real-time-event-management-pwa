const getEvents = async (place) => {
    // const apiKey = "YOUR_SERPAPI_KEY"; // Replace with your actual API key
    const url = `https://serpapi.com/search.json?q=events+in+${place}&location=${place}&engine=google_events&api_key=${"32ebda1421d5ec8b5e922075ade9d9d3ac2ac3e2139bb74f064017b963784584"}`;
    
    try {
        let res = await fetch(url);
        let data = await res.json();
        console.log(data.events_results[0]);

        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};
getEvents("dhanbad");

//module.exports = getEvents;


