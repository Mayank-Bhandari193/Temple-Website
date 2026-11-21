/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - YOUTUBE BHAKTI HUB
 * Official Channel: Smt. Pushpa Bhandari (@pushpabhandari6645)
 * Zero Buggy Iframes - 100% Reliable Direct Streaming & Sacred Audio Interactions
 */

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@pushpabhandari6645";

const BHAKTI_PLAYLIST = [
  {
    id: "bhajan-1",
    title: "Shree Siddhivinayak Maha Aarti & Mangal Gaan",
    category: "Aarti & Stuti",
    duration: "12:45",
    views: "185K",
    url: YOUTUBE_CHANNEL_URL,
    thumbnail: "https://images.unsplash.com/photo-1567591370504-8b631d575459?q=80&w=600&auto=format&fit=crop",
    desc: "Devotional invocation and traditional Ganesha aarti for obstacle removal and spiritual bliss."
  },
  {
    id: "bhajan-2",
    title: "Devbhoomi Uttarakhand Traditional Jagar & Bhagwati Vandana",
    category: "Devbhoomi Folk & Jagar",
    duration: "18:20",
    views: "240K",
    url: YOUTUBE_CHANNEL_URL,
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
    desc: "Sacred folk jagars echoing through the Himalayas, invoking the divine grace of Mata Nanda Devi."
  },
  {
    id: "bhajan-3",
    title: "Om Namah Shivaya & Kedarnath Maha Rudra Jaap",
    category: "Shiva Bhakti",
    duration: "21:10",
    views: "310K",
    url: YOUTUBE_CHANNEL_URL,
    thumbnail: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=600&auto=format&fit=crop",
    desc: "Peaceful 108 chants of Mahadev Shiva stuti, meditation, and continuous Bhasma aarti hymns."
  },
  {
    id: "bhajan-4",
    title: "Sharadiya Navratri Chandi Stotram & Mata Mangal Geet",
    category: "Mata Bhajan",
    duration: "15:35",
    views: "195K",
    url: YOUTUBE_CHANNEL_URL,
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
    desc: "Sacred hymns honoring Ashta Lakshmis and Durga Saptashati with traditional dhol-damau rhythms."
  }
];

// Open official channel with sacred effects
function openSpiritualChannel(trackTitle) {
  if (window.SoundEngine) window.SoundEngine.playTempleBell();
  if (window.flowerShower) window.flowerShower.burst(50);
  window.open(YOUTUBE_CHANNEL_URL, '_blank', 'noopener,noreferrer');
}

document.addEventListener('DOMContentLoaded', () => {
  // Playlist container rendering (if present)
  const playlistContainer = document.getElementById('yt-playlist-container');
  if (playlistContainer) {
    playlistContainer.innerHTML = BHAKTI_PLAYLIST.map((item, index) => `
      <div class="yt-playlist-item ${index === 0 ? 'active' : ''}" data-video-index="${index}" style="cursor: pointer;">
        <div class="yt-thumb-wrap">
          <img src="${item.thumbnail}" alt="${item.title}">
          <div class="yt-play-overlay">▶</div>
        </div>
        <div style="flex: 1;">
          <div class="yt-item-title">${item.title}</div>
          <div class="yt-item-meta">
            <span>${item.category}</span> &bull; <span>⏱️ ${item.duration}</span> &bull; <span>👁️ ${item.views}</span>
          </div>
        </div>
      </div>
    `).join('');

    const items = playlistContainer.querySelectorAll('.yt-playlist-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const idx = parseInt(item.dataset.videoIndex, 10);
        const video = BHAKTI_PLAYLIST[idx];

        openSpiritualChannel(video.title);
      });
    });
  }

  // Hook all video cards to open official channel safely
  document.querySelectorAll('.video-thumb-container, .yt-card-clickable').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      openSpiritualChannel();
    });
  });

  // Re-run 3D card tilt if available
  if (window.init3DCardTilt) {
    window.init3DCardTilt();
  }
});
