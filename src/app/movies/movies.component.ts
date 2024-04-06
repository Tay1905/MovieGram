import { Component, OnInit, inject, NgModule } from '@angular/core';
import { movieService } from '../service/movie.service';
import { MovieDetail } from '../interface/movie-detail';
import { environment } from '../../environments/environment.development';
import { ShowDetails } from '../interface/show-details';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



const imgUrl = environment.imgUrl;

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule,  FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {
  private movieService = inject(movieService)

  /**
 * Arrays to store movie details
 */
  ratedMovies: MovieDetail[] = [];
  trendingMovies: MovieDetail[] = [];
  upcomingMovies: MovieDetail[] = [];
  popularMovies: MovieDetail[] = [];

  /**
 * Arrays to store show details
 */
  popularShows: ShowDetails[] = [];
  ratedShows: ShowDetails[] = [];
  airingShows: ShowDetails[] = [];


/**
 * Boolean flag to control display of show details
 */
  showDetails: boolean = true;

  /**
 * Currently selected show details
 */
  selectedShow: ShowDetails | null = null;

  /**
 * Sample user opinions
 */
  UserOpinions = [
    { name: "User 1", image: "../../assets/img/user1.jpg", opinion: "Gave 'The Witcher' a try. Interesting world-building, but the plot felt a bit slow at times." },
    { name: "User 2", image: "../../assets/img/user6.png", opinion: "Breaking Bad is amazing, you won't regret watching it!" },
    { name: "User 3", image: "../../assets/img/user3.jpg", opinion: "'You' is definitely suspenseful, but the main character's perspective can be a bit unsettling." },
  ];
  UserOpinions2 = [
    { name: "User 1", image: "../../assets/img/user4.jpg", opinion: "For all the Trekkies out there, 'Star Trek: Deep Space Nine' is a hidden gem. Intriguing characters and complex storylines." },
    { name: "User 2", image: "../../assets/img/user5.png", opinion: "'Mind of a Chef' is a must-watch for anyone who loves food and creativity. An inspiring look at the culinary world." },
    { name: "User 3", image: "../../assets/img/user2.jpg", opinion: "If you need a nature escape, 'Planet Earth' is simply breathtaking. Stunning visuals and a powerful message about conservation." },
  ];

  /**
 * Variable to store new user opinion
 */
  newOpinion: string = '';

  videoUrl: string ='';

  safeVideoUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
    this.loadMovies();
    this.getShows();

    this.getVideoUrl()
    .then(url => {
      this.videoUrl = url;
    })
    .catch(error => {
      console.error('Error fetching video URL:', error);
    });

  }


/**
 * Simulierte Funktion zum Abrufen des Video-URLs
 */
  async getVideoUrl(): Promise<string> {
    return 'https://www.youtube.com/embed/_YUzQa_1RCE?si=a_vNy-tQ-RpqzEOa';
  }

  markVideoUrlAsSafe(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
 *  Function to save user opinion
 */
  saveOpinion() {
    if (this.newOpinion.trim() !== '') {
      const userName = 'guestUser';
      const userImage = "../../assets/img/user6.png";
      this.UserOpinions2.push({
        name: userName,
        image: userImage,
        opinion: this.newOpinion
      });
      this.newOpinion = '';
    } else {
      console.error('Please enter your opinion.');
    }
  }

  /**
 * Function to close show details
 */
  closeInfo = () => {
    this.showDetails = false;
    this.selectedShow = null;
  };

  /**
 * Function to display show details
 */
  showInfo(x: ShowDetails) {
    this.selectedShow = x;
    this.showDetails = true;
  }

  /**
 * Function to search movies
 */
  searchMovies() {
    const searchTerm = (document.getElementById('search-input') as HTMLInputElement).value.trim();
    if (searchTerm.length > 5) { 
      const url = `${environment.searchMovieUrl, environment.upcomingMovieUrl, environment.trendingMovieUrl}?api_key=${environment.apiKey}&query=${searchTerm}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const filteredMovies = data.results.filter((x: ShowDetails) =>
              x.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredMovies.length > 0) {
              this.showInfo(filteredMovies[0]);
              (document.getElementById('search-input') as HTMLInputElement).value = '';
            } else {
              let searchTerm = (document.getElementById('search-input') as HTMLInputElement).value.trim();
              alert(`${searchTerm} was not found`);
            }
          } 
        })
        .catch(error => console.error('Error fetching movies:', error));
    } 
  }
  

/**
 * Function to load movies
 */
  loadMovies() {
    this.rated();
    this.upcoming();
    this.trending();
    this.popular();
  }

  /**
   * Function to get show details
   */
  getShows() {
    this.airingTv();
    this.popularTv();
    this.ratedTv();
  }

  /**
   * Function to construct full image URL
   */ 
  getFullImageUrl(poster_path: string): string {
    return imgUrl + poster_path;
  }

  /**
   * Functions to fetch top rated, popular, upcoming, and trending movies
   */
  rated() {
    this.movieService.getTopRatedMovies().subscribe({
      next: (res: any) => {
        this.ratedMovies = res.results as MovieDetail[];
      },
      error: (error: any) => console.log('Error fetching movies:', error)
    });
  }
  popular() {
    this.movieService.getPopularMovies().subscribe({
      next: (popularMovies: any) => {
        this.popularMovies = popularMovies.results as MovieDetail[];
      },
      error: (error: any) => console.log('Error fetching popular movies:', error)
    });
  }
  upcoming() {
    this.movieService.getUpcomingMovies().subscribe({
      next: (upcomingMovies: any) => {
        this.upcomingMovies = upcomingMovies.results as MovieDetail[];
      },
      error: (error: any) => console.log('Error fetching upcoming movies:', error)
    });
  }
  trending() {
    this.movieService.getTrendingMovies().subscribe({
      next: (trendingMovies: any) => {
        this.trendingMovies = trendingMovies.results as MovieDetail[];
      },
      error: (error: any) => console.log('Error fetching trending movies:', error)
    });

  }

  /**
   * Functions to fetch top rated, popular, and airing TV shows
   */
  ratedTv() {
    this.movieService.getRatedTvShows().subscribe({
      next: (res: any) => {
        this.ratedShows = res.results as ShowDetails[];
      },
      error: (error: any) => console.log(error)
    });
  }
  airingTv() {
    this.movieService.getAiringTvShows().subscribe({
      next: (res: any) => {
        this.airingShows = res.results as ShowDetails[];
      },
      error: (error: any) => console.log(error)
    });
  }
  popularTv() {
    this.movieService.getPopularTvShows().subscribe({
      next: (res: any) => {
        this.popularShows = res.results as ShowDetails[];
      },
      error: (error: any) => console.log(error)
    });
  }



}

