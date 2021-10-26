export class News {
    getAll() {
        const tema = document.getElementById("search_bar").value;
        console.log(tema);
        const url = "https://newsapi.org/v2/everything?q=" + tema + "&sortBy=popularity&apiKey=12c6dbbefea94326b599d7d888c0d4ff";
        return axios.get(url);
    }
}
