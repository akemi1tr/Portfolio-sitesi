const DISCORD_ID = '1091415573990219806';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;
const GITHUB_USERNAME = 'akemi1tr';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_API = `${GITHUB_API}/repos`;

let allRepos = [];
let displayedRepos = 0;
const reposPerPage = 6;

async function fetchProfileData() {
    try {
        const response = await fetch(LANYARD_API);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return null;
    }
}

function updateProfile(data) {
    if (data) {
        document.getElementById('profile-image').src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;
        document.getElementById('username').textContent = data.discord_user.username;
        updateStatus(data.discord_status);
        updateSpotifyActivity(data);
        if (data.activities && data.activities.length > 0) {
            const codingActivity = data.activities.find(activity => activity.type === 0);
            if (codingActivity) {
                document.getElementById('activity-text').textContent = codingActivity.name;
                document.getElementById('coding-activity').style.display = 'inline-flex';
            } else {
                document.getElementById('coding-activity').style.display = 'none';
            }
        }
        if (data.discord_user.banner) {
            document.querySelector('.banner').style.backgroundImage = `url(https://cdn.discordapp.com/banners/${DISCORD_ID}/${data.discord_user.banner}.png?size=1024)`;
        }
    }
}

function updateStatus(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    switch(status) {
        case 'online':
            statusIndicator.style.backgroundColor = '#2ecc71';
            break;
        case 'idle':
            statusIndicator.style.backgroundColor = '#f1c40f';
            break;
        case 'dnd':
            statusIndicator.style.backgroundColor = '#e74c3c';
            break;
        default:
            statusIndicator.style.backgroundColor = '#95a5a6';
    }
}

function updateSpotifyActivity(data) {
    const spotifyActivity = document.getElementById('spotify-activity');
    const spotifyText = document.getElementById('spotify-text');
    if (data.listening_to_spotify) {
        spotifyText.textContent = `Listening to ${data.spotify.song} by ${data.spotify.artist}`;
        spotifyActivity.style.display = 'inline-flex';
    } else {
        spotifyActivity.style.display = 'none';
    }
}

function changeTheme(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--hover-color', adjustColor(color, 20));
    localStorage.setItem('theme-color', color);
}

function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function loadSavedTheme() {
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
        changeTheme(savedColor);
    }
}

document.querySelector('.theme-toggle').addEventListener('click', () => {
    const palette = document.querySelector('.theme-palette');
    palette.style.display = palette.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.style.backgroundColor = btn.dataset.color;
    btn.addEventListener('click', () => {
        changeTheme(btn.dataset.color);
    });
});

function loadProjects() {
    const projects = [
        {
            name: "McStatus",
            description: "A JavaScript project for server status monitoring",
            stars: 2,
            forks: 0,
            image: "https://picsum.photos/300/200?random=1",
            link: "#"
        },
        {
            name: "WebApp",
            description: "A responsive web application built with React",
            stars: 5,
            forks: 2,
            image: "https://picsum.photos/300/200?random=2",
            link: "#"
        },
        {
            name: "API Service",
            description: "A RESTful API service built with Node.js",
            stars: 3,
            forks: 1,
            image: "https://picsum.photos/300/200?random=3",
            link: "#"
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-item';
        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.name}">
            <div class="project-info">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${project.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                </div>
                <a href="${project.link}" class="project-link">View Project</a>
            </div>
        `;
        projectsGrid.appendChild(projectElement);
    });
}

async function fetchGitHubStats() {
    try {
        const response = await fetch(GITHUB_API);
        const data = await response.json();
        document.getElementById('total-repos').textContent = data.public_repos;
        
        document.getElementById('total-commits').textContent = '1000+';
        document.getElementById('total-stars').textContent = '50+';
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function setActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
}

function initializeSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.skill-level').style.width = entry.target.querySelector('.skill-level').style.width;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => {
        item.querySelector('.skill-level').style.width = '0%';
        observer.observe(item);
    });
}

function initializeSkillFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            skillItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function initializeScrollToTop() {
    const scrollToTopButton = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollToTopButton.style.display = 'flex';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    });

    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

async function init() {
    loadSavedTheme();
    const profileData = await fetchProfileData();
    updateProfile(profileData);
    
    loadProjects();
    await fetchGitHubStats();

    setActiveNavItem();
    initializeSkillAnimations();
    initializeSkillFilter();
    initializeScrollToTop();

    
    document.querySelector('.loading-overlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', init);