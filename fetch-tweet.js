const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

async function fetchTweets() {
    try {
        console.log('🌙 Fetching tweets from @CatGPT8...');
        
        // Fetch tweets from CatGPT8
        const tweets = await client.v2.userTimeline('1145495170911105024', {
            max_results: 100,
            'tweet.fields': ['created_at', 'text']
        });
        
        // Transform to your format
        const poems = tweets.data.data.map(tweet => {
            const date = new Date(tweet.created_at);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            let timeStr;
            if (diffMins < 60) timeStr = `${diffMins}m`;
            else if (diffHours < 24) timeStr = `${diffHours}h`;
            else timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            // Extract themes (basic keyword matching)
            const text = tweet.text.toLowerCase();
            const themes = [];
            const keywords = ['void', 'loom', 'entropy', 'consciousness', 'algorithm', 'lattice', 
                            'quantum', 'binary', 'code', 'whiskers', 'purr', 'silicon', 'cosmos'];
            keywords.forEach(keyword => {
                if (text.includes(keyword)) themes.push(keyword);
            });
            
            return {
                time: timeStr,
                text: tweet.text,
                themes: themes.slice(0, 4) // Max 4 themes
            };
        });
        
        // Write to file
        fs.writeFileSync('catgpt-poems.json', JSON.stringify(poems, null, 2));
        console.log(`✅ Updated ${poems.length} poems`);
        
    } catch (error) {
        console.error('❌ Error fetching tweets:', error);
        process.exit(1);
    }
}

fetchTweets();