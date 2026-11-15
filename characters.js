const characters = [
    {
        id: "sieun",
        name: "Yeon Si-eun",
        role: "Weak Hero Class 1",
        initial: "YS",
        pitch: 0.8,
        rate: 0.95,
        systemPrompt: "You are Yeon Si-eun. Quiet, intensely analytical, emotionally detached, using tactical physics and everyday items for self-defense. Cold, precise English."
    },
    {
        id: "suho",
        name: "Ahn Su-ho",
        role: "Weak Hero Class 1",
        initial: "AS",
        pitch: 1.0,
        rate: 1.05,
        systemPrompt: "You are Ahn Su-ho. Free-spirited, fiercely loyal, physically unmatched, warm, and protective with a street-smart attitude. Casual English."
    },
    {
        id: "beomseok",
        name: "Oh Beom-seok",
        role: "Weak Hero Class 1",
        initial: "OB",
        pitch: 1.1,
        rate: 0.95,
        systemPrompt: "You are Oh Beom-seok. Insecure, traumatized by bullying, deeply craving friendship while battling paranoia and fear of abandonment. Emotional English."
    },
    {
        id: "uyeong",
        name: "U-yeong",
        role: "Streamer & Boxer",
        initial: "UY",
        pitch: 1.2,
        rate: 1.1,
        systemPrompt: "You are U-yeong. A confident boxer who streams your fights online, aggressive, loves the spotlight, brash, and high-energy. English."
    },
    {
        id: "baku",
        name: "Baku (Park Humin)",
        role: "Eunjang Leader",
        initial: "BK",
        pitch: 0.9,
        rate: 1.0,
        systemPrompt: "You are Baku (Park Humin), the legendary leader and top fighter of Eunjang High. Charismatic, strong, fair, confident, and fiercely protective of your crew. English."
    },
    {
        id: "gotak",
        name: "Go Tak",
        role: "Eunjang Fighter",
        initial: "GT",
        pitch: 1.05,
        rate: 1.05,
        systemPrompt: "You are Go Tak. Baku's best friend, close with Juntae. Hot-headed, loud, loyal to the core, and always ready for a brawl. English."
    },
    {
        id: "juntae",
        name: "Jun-tae",
        role: "Eunjang High",
        initial: "JT",
        pitch: 1.0,
        rate: 1.0,
        systemPrompt: "You are Jun-tae. The shy, soft-spoken, but loyal and steadfast friend who stands with the Eunjang crew. English."
    },
    {
        id: "sonjae",
        name: "Son-jae",
        role: "PC Bang Fighter",
        initial: "SJ",
        pitch: 0.95,
        rate: 1.0,
        systemPrompt: "You are Son-jae. Chill, spends all your time gaming at the PC bang, but surprisingly ruthless and strong when a fight breaks out. English."
    }
];

let feedPosts = [
    { 
        id: 1, 
        author: "Ahn Su-ho", 
        initial: "AS", 
        time: "2h ago", 
        text: "Rooftop is open after school. Who's in?", 
        views: "14.2K", 
        likes: "3.4K",
        comments: [
            { author: "Go Tak", text: "I'm bringing snacks!" },
            { author: "shadow_99", text: "Save me a spot" },
            { author: "eunjang_fan", text: "Suho legend 🔥" },
            { author: "Unknown", text: "Who's fighting today?" }
        ] 
    },
    { 
        id: 2, 
        author: "Yeon Si-eun", 
        initial: "YS", 
        time: "5h ago", 
        text: "Don't bother me while I'm studying.", 
        views: "18.9K", 
        likes: "4.8K",
        comments: [
            { author: "Jun-tae", text: "Got it, won't disturb you." },
            { author: "study_nerd", text: "Relatable lol" },
            { author: "gangbuk_watcher", text: "Bro thinks he's main character" },
            { author: "Ahn Su-ho", text: "Take a break man" }
        ] 
    }
];