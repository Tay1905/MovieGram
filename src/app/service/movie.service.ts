import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDetail } from '../interface/movie-detail';
import { ShowDetails } from '../interface/show-details';

//MoviesUrl 
const topRatedUrl = environment.topRatedMovieUrl;
const trendingUrl = environment.trendingMovieUrl;
const upcomingUrl = environment.upcomingMovieUrl;
const popularUrl = environment.popularMovieUrl;
//TvShowUrl 
const popularTvUrl = environment.popularTvUrl;
const ratedTvUrl = environment.topRatedTvUrl;
const airingTodayTvUrl = environment.airingTodayTvUrl;


const apiKey = environment.apiKey;
@Injectable({
  providedIn: 'root'
})
export class movieService {


  constructor(private http: HttpClient) { }

  getTopRatedMovies(): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${topRatedUrl}?api_key=${apiKey}`);
  }
  getTrendingMovies(): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${trendingUrl}?api_key=${apiKey}`);
  }
  getUpcomingMovies(): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${upcomingUrl}?api_key=${apiKey}`);
  }
  getPopularMovies(): Observable<MovieDetail> {
    return this.http.get<MovieDetail>(`${popularUrl}?api_key=${apiKey}`);
  }



  getPopularTvShows(): Observable<ShowDetails> {
    return this.http.get<ShowDetails>(`${popularTvUrl}?api_key=${apiKey}`);
  }
  getRatedTvShows(): Observable<ShowDetails> {
    return this.http.get<ShowDetails>(`${ratedTvUrl}?api_key=${apiKey}`);
  }
  getAiringTvShows(): Observable<ShowDetails> {
    return this.http.get<ShowDetails>(`${airingTodayTvUrl}?api_key=${apiKey}`);
  }

  searchMovies(searchTerm: string): Observable<MovieDetail> {
    const searchUrl = `${environment.searchMovieUrl}?api_key=${environment.apiKey}&query=${searchTerm}`;
    return this.http.get<MovieDetail>(searchUrl);
  }
}
