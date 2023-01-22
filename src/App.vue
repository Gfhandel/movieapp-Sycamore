<template>
  <div id="app">
    <div
      class="max-w-screen-xl mx-auto my-5 rounded-3xl shadow-lg bg-white p-7"
    >
      <div>
        <!-- Error -->
        <DataFailedComponent
          v-if="mountedDataFailed"
          :fetchMethod="initPage"
          :isSubmitted="isSubmitted"
          :errorMessage="errorMessage"
        />

        <!-- Main -->
        <template v-else>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div class="col-span-5 lg:col-span-2 mb-10 lg:mb-0">
              <h3 class="font-bold">The sidebar</h3>
            </div>
            <div class="col-span-5 lg:col-span-8 mb-10 lg:mb-0">
              <div>
                <img
                  :src="getPosterPath(introMovie ? introMovie.poster_path : '')"
                  @click="getMovieDetail(introMovie.id)"
                  class="rounded-3xl w-full h-fit cursor-pointer"
                  alt=""
                />
              </div>

              <div class="mt-10">
                <h2 class="font-bold mt-5 mb-3">Best Artists</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div v-for="(person, id) in persons" :key="id">
                    <img :src="getPosterPath(person.profile_path)" alt="" />
                    <h3
                      class="text-sm my-1"
                      @click="getMovieDetail(person.id)"
                      v-text="person.name"
                    ></h3>
                  </div>
                </div>
              </div>

              <div class="mt-10">
                <h2 class="font-bold mb-3">Continue Watching</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div v-for="(discovery, id) in discoveries" :key="id">
                    <img
                      @click="getMovieDetail(discovery.id)"
                      :src="getPosterPath(discovery.poster_path)"
                      alt=""
                      class="cursor-pointer"
                    />
                    <h3
                      class="text-sm mt-1 cursor-pointer"
                      @click="getMovieDetail(discovery.id)"
                      v-text="discovery.title"
                    ></h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-5 lg:col-span-2 mb-10 lg:mb-0">
              <form @submit.prevent="performSearch">
                <input
                  type="text"
                  class="form-input"
                  name="search"
                  placeholder="Search"
                  v-model="search"
                  required
                  @onkeydown="performSearch"
                />
              </form>
              <div class="mt-10">
                <h2 class="font-bold mb-3">Popular Movies</h2>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"
                  v-for="(trendingMovie, id) in trendingMovies"
                  :key="id"
                >
                  <img
                    @click="getMovieDetail(trendingMovie.id)"
                    :src="getPosterPath(trendingMovie.poster_path)"
                    alt=""
                    class="cursor-pointer"
                  />
                  <div class="flex flex-col justify-between">
                    <h3
                      class="
                        text-sm
                        mt-1
                        cursor-pointer
                        text-clip
                        font-semibold
                      "
                      @click="getMovieDetail(trendingMovie.id)"
                      v-text="trendingMovie.title"
                    ></h3>
                    <div class="text-xs">
                      <span class="bg-yellow-200 font-bold p-1 rounded"
                        >IMDB</span
                      >
                      {{ roundVoting(trendingMovie.vote_average) }}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn-primary"
                  @click="moreMovies('Trendy movies have been retrieved!')"
                >
                  See more
                </button>
              </div>
              <div class="mt-10">
                <h2 class="font-bold mb-3">Favorites Movies</h2>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3"
                  v-for="(favorite, id) in favorites"
                  :key="id"
                >
                  <img
                    @click="getMovieDetail(favorite.id)"
                    :src="getPosterPath(favorite.poster_path)"
                    alt=""
                    class="cursor-pointer"
                  />
                  <div class="flex flex-col justify-between">
                    <h3
                      class="
                        text-sm
                        mt-1
                        cursor-pointer
                        text-clip
                        font-semibold
                      "
                      @click="getMovieDetail(favorite.id)"
                      v-text="favorite.title"
                    ></h3>
                    <div class="text-xs">
                      <span class="bg-yellow-200 font-bold p-1 rounded"
                        >IMDB</span
                      >
                      {{ roundVoting(favorite.vote_average) }}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  class="btn-primary"
                  @click="moreMovies('Favorite movies have been retrieved!')"
                >
                  See more
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- The Modal -->
    <div id="myModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close">&times;</span>
        <template v-if="!errorMessage">
          <h3 class="font-bold text-center mb-5">
            {{ movieDetail ? movieDetail.title : "" }}
          </h3>
          <div class="grid gap-8 grid-cols-1 lg:grid-cols-2 flex items-center">
            <img
              :src="getPosterPath(movieDetail ? movieDetail.poster_path : '')"
              class="rounded-3xl w-full h-fit"
              alt=""
            />
            <div>
              <div>
                <h3 class="font-bold text-left mt-3">Overview</h3>
                <p>
                  {{ movieDetail ? movieDetail.overview : "" }}
                </p>
              </div>
              <div>
                <h3 class="font-bold text-left mt-3">Release Date</h3>
                <p>
                  {{
                    getFormattedDate(
                      movieDetail ? movieDetail.release_date : ""
                    )
                  }}
                </p>
              </div>
              <div>
                <h3 class="font-bold text-left mt-3">Spoken Languages</h3>
                <span
                  class="
                    bg-red-500
                    px-2
                    py-2
                    mb-2
                    mr-1
                    text-xs text-white
                    rounded-3xl
                    inline-block
                  "
                  v-for="(spoken_language, iso_639_1) in movieDetail
                    ? movieDetail.spoken_languages
                    : ''"
                  :key="iso_639_1"
                >
                  {{ spoken_language.name }}
                </span>
              </div>
              <div>
                <h3 class="font-bold text-left mt-3">Production Companies</h3>
                <span
                  class="
                    bg-purple-500
                    px-2
                    py-2
                    mb-2
                    mr-1
                    text-xs text-white
                    rounded-3xl
                    inline-block
                  "
                  v-for="(production_company, id) in movieDetail
                    ? movieDetail.production_companies
                    : ''"
                  :key="id"
                >
                  {{ production_company.name }}
                </span>
              </div>
              <div>
                <h3 class="font-bold text-left mt-3">Genres</h3>
                <span
                  class="
                    bg-green-500
                    px-2
                    py-2
                    mb-2
                    mr-1
                    text-xs text-white
                    rounded-3xl
                    inline-block
                  "
                  v-for="(genre, id) in movieDetail ? movieDetail.genres : ''"
                  :key="id"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <h3 class="font-bold text-left mt-5">Error Occurred</h3>
          <p>
            {{ errorMessage }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DataFailedComponent from "@/components/Generics/DataFailedComponent.vue";

import { getFormattedDate } from "@/__helpers/core";

export default {
  name: "App",
  components: {
    DataFailedComponent,
  },

  data() {
    return {
      search: null,
      movieDetail: null,
      introMovie: null,

      trendingMovies: [],
      favorites: [],
      discoveries: [],
      persons: [],

      isSubmitted: false,
      mountedDataFailed: false,

      baseImgPath: "https://image.tmdb.org/t/p/w500",

      errorMessage: null,
      apiKey: `?api_key=${process.env.VUE_APP_MOVIE_API_KEY}`,
    };
  },

  computed: {},

  watch: {},

  created() {},

  methods: {
    async initPage() {
      this.isSubmitted = true;

      try {
        const trendingMovies = await this.$http.get(
          `trending/movie/week${this.apiKey}`
        );
        const discoveries = await this.$http.get(
          `discover/movie${this.apiKey}`
        );
        const persons = await this.$http.get(`person/popular${this.apiKey}`);

        let trendingMovieRes = trendingMovies.data.results;
        // take few
        this.trendingMovies = trendingMovieRes.slice(0, 5);
        this.introMovie =
          this.trendingMovies[
            Math.floor(Math.random() * this.trendingMovies.length)
          ];
        this.favorites = trendingMovieRes.reverse().slice(5, 10);

        this.persons = persons.data.results.slice(0, 4);
        this.discoveries = discoveries.data.results.reverse().slice(0, 8);
      } catch (error) {
        this.isSubmitted = false;
        this.mountedDataFailed = true;
        this.errorMessage = error.response.data.status_message;
      }
    },

    getPosterPath(poster_path) {
      return this.baseImgPath + poster_path;
    },

    getMovieDetail(movieId) {
      // Get the modal
      var modal = document.getElementById("myModal");

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "block";

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };

      this.movieDetail = null;

      this.$http
        .get(`movie/${movieId}${this.apiKey}`)
        .then((response) => {
          this.movieDetail = response.data;
        })
        .catch((error) => {
          this.errorMessage = error.response.data.status_message;
        });
    },

    getFormattedDate(date) {
      return getFormattedDate(date);
    },

    roundVoting(decimal) {
      return Math.round((decimal + Number.EPSILON) * 100) / 100;
    },

    /**
     * Intended to get more trendy movies
     *
     * Currently displays alert of false success!
     * @return void
     */
    moreMovies(msg) {
      alert(msg);
    },

    /**
     * Intended to perform search
     *
     * Current displays an alert
     *
     * @return method - moreMovies()
     */
    performSearch() {
      return this.moreMovies("Search results have been retrieved");
    },
  },

  mounted() {
    this.initPage();
  },
};
</script>




<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: #fbfbfb;
  font-family: "Montserrat", sans-serif !important;
  color: #232020;
  box-sizing: border-box;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
