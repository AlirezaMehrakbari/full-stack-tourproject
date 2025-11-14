export const getHotels = async (req, res) => {
    const hotels = [
        { name: "هتل اسپیناس پالاس", city: "تهران", stars: 5 },
        { name: "هتل داریوش", city: "کیش", stars: 4 }
    ];
    res.json(hotels);
};
