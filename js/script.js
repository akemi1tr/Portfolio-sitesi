$(document).ready(function(){
   
    $('.theme-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        if ($('body').hasClass('dark-mode')) {
            $(this).html('<i class="fas fa-sun"></i>');
            localStorage.setItem('theme', 'dark');
        } else {
            $(this).html('<i class="fas fa-moon"></i>');
            localStorage.setItem('theme', 'light');
        }
    });

    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-mode');
        $('.theme-toggle').html('<i class="fas fa-sun"></i>');
    }

    
    $('.menu-toggle').click(function() {
        $('.mobile-menu').toggleClass('active');
        $('body').toggleClass('menu-open');
    });

    
    $('.mobile-menu a').click(function() {
        $('.mobile-menu').removeClass('active');
        $('body').removeClass('menu-open');
    });

    
    $('a.nav-link').smoothScroll({
        offset: -70, 
        speed: 1500,
        easing: 'easeInOutQuint'
    });

    
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false
    });

    // GitHub projelerini çek
    function fetchGitHubProjects() {
        $.ajax({
            url: 'https://api.github.com/users/akemi1tr/repos',
            method: 'GET',
            success: function(repos) {
                const projectGrid = $('.project-grid');
                projectGrid.empty();

                repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

                repos.slice(0, 3).forEach((repo, index) => {
                    const projectCard = `
                        <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                            <div class="project-image" style="background-image: url('${repo.owner.avatar_url}')"></div>
                            <div class="project-info">
                                <h3 class="project-title">${repo.name}</h3>
                                <p class="project-description">${repo.description || 'No description available.'}</p>
                                <p class="project-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</p>
                                <div class="project-links">
                                    <a href="${repo.html_url}" target="_blank" class="project-link"><i class="fab fa-github"></i> View Code</a>
                                </div>
                            </div>
                        </div>
                    `;
                    projectGrid.append(projectCard);
                });
            },
            error: function(err) {
                console.error('Error fetching GitHub projects:', err);
                $('.project-grid').html('<p>Failed to load projects. Please try again later.</p>');
            }
        });
    }

    fetchGitHubProjects();


    var typed = new Typed('.typewriter', {
        strings: ["Crafting digital experiences", "Building responsive websites", "Creating user-friendly interfaces"],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 1000,
        loop: true
    });

  
    const userId = "1091415573990219806";
    const apiUrl = `https://api.lanyard.rest/v1/users/${userId}`;

    function updateUserActivity(data) {
        const activities = data.activities;
        const spotify = data.spotify;
        const user = data.discord_user;

        
        if (user) {
            const profilePic = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            $('#profile-pic').attr('src', profilePic);
            $('.about-text p:first').html(`Hello! I'm ${user.username}, a passionate 17-years old full-stack web developer with a keen eye for design and a love for clean, efficient code. With 4 years of experience in the field, I specialize in creating responsive and user-friendly web applications.`);
        }

        // Spotify
        if (spotify) {
            const { song, artist, album_art_url } = spotify;
            $('#spotify-activity').html(`
                <div class="activity-content">
                    <img src="${album_art_url}" alt="Album Art" />
                    <div class="activity-info">
                        <h4>${song}</h4>
                        <p>${artist}</p>
                    </div>
                </div>
            `);
        } else {
            $('#spotify-activity').html('<p>Not listening to Spotify</p>');
        }

        // Oyunlar ve VSCode kısmı helelee
        const gameActivities = activities.filter(activity => activity.type === 0 && activity.application_id !== "383226320970055681");
        const vscodeActivity = activities.find(activity => activity.application_id === "383226320970055681");

        // Oyunları gösteren yer bura tam mı
        if (gameActivities.length > 0) {
            const gamesHtml = gameActivities.map(game => getActivityHtml(game)).join('');
            $('#games-activity').html(gamesHtml);
        } else {
            $('#games-activity').html('<p>Not playing any games</p>');
        }

       
        if (vscodeActivity) {
            $('#vscode-activity').html(getActivityHtml(vscodeActivity));
        } else {
            $('#vscode-activity').html('<p>Not using VSCode</p>');
        }
    }

    function getActivityHtml(activity) {
        let imageUrl = '';
        if (activity.assets) {
            if (activity.assets.large_image) {
                if (activity.assets.large_image.startsWith('mp:')) {
                    imageUrl = `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
                } else if (activity.assets.large_image.startsWith('external/')) {
                    imageUrl = `https://media.discordapp.net/external/${activity.assets.large_image.split('external/')[1]}`;
                } else {
                    imageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                }
            } else if (activity.application_id) {
                imageUrl = `https://cdn.discordapp.com/app-icons/${activity.application_id}/${activity.assets.small_image}.png`;
            }
        }

        return `
            <div class="activity-content">
                ${imageUrl ? `<img src="${imageUrl}" alt="${activity.name}" />` : ''}
                <div class="activity-info">
                    <h4>${activity.name}</h4>
                    <p>${activity.details || ''}</p>
                    ${activity.state ? `<p>${activity.state}</p>` : ''}
                </div>
            </div>
        `;
    }

    function fetchUserActivity() {
        $.getJSON(apiUrl, function(response) {
            if (response.success) {
                const data = response.data;
                updateUserActivity(data);
            } else {
                console.error("Failed to retrieve data from Lanyard API.");
            }
        });
    }

    fetchUserActivity();

    
    setInterval(fetchUserActivity, 10000);

   
    function addNeonUnderline() {
        $('.section-title').each(function() {
            if (!$(this).next('.neon-underline').length) {
                $(this).after('<div class="neon-underline"></div>');
            }
        });
    }

    
    addNeonUnderline();
    $(window).resize(addNeonUnderline);

   
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        const btn = $(this).find('button');
        btn.addClass('button-loading');
        setTimeout(function() {
            btn.removeClass('button-loading').addClass('button-success');
            $('#form-message').removeClass('error').addClass('success').text('Your message has been sent successfully!');
            setTimeout(function() {
                btn.removeClass('button-success');
            }, 2000);
        }, 2000);
    });

    const cursor = document.querySelector('.cursor');
    const cursorinner = document.querySelector('.cursor2');

    document.addEventListener('mousemove', function(e){
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    });

    document.addEventListener('mousemove', function(e){
        let x = e.clientX;
        let y = e.clientY;
        cursorinner.style.left = x + 'px';
        cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function(){
        cursor.classList.add('click');
        cursorinner.classList.add('cursorinnerhover');
    });

    document.addEventListener('mouseup', function(){
        cursor.classList.remove('click');
        cursorinner.classList.remove('cursorinnerhover');
    });

    $('a').on('mouseenter', function() {
        cursor.classList.add('hover');
    });

    $('a').on('mouseleave', function() {
        cursor.classList.remove('hover');
    });

   
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-top').addClass('show');
        } else {
            $('.scroll-to-top').removeClass('show');
        }
    });

    $('.scroll-to-top').click(function() {
        $('html, body').animate({scrollTop : 0}, 800);
        return false;
    });

  
    $(document).mousemove(function(e) {
        const moveX = (e.pageX * -1 / 25);
        const moveY = (e.pageY * -1 / 25);
        $('.hero').css('background-position', moveX + 'px ' + moveY + 'px');
    });

   
    $('.for-sale-card').hover(
        function() {
            $(this).find('.loading-bar').addClass('active');
        },
        function() {
            $(this).find('.loading-bar').removeClass('active');
        }
    );
});