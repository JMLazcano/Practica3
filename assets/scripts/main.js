import { News } from './news.js';
document.getElementById("search_bar").oninput = function () {
    const news = new News();
    news.getAll().then(response => {
        console.log('News', response.data);
        let source = document.getElementById('grid-source').innerHTML;
        const context = { news: response.data.articles };
        const template = Handlebars.compile(source);
        const resultHtml = template(context);
        document.getElementById('grid').innerHTML = resultHtml;
    }).catch(err => {
        console.error('Request failed');
    });
};
