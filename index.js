async function load() {
    const booksContainer = document.getElementById("listBooks");
    const spinner = loader();
    
    booksContainer.appendChild(spinner);
    
    try {
        const books = await fetch("/books.json").then((d) => d.json());
        for(const book of books){
            booksContainer.appendChild(generateBookPreview(book));
        }
    } catch (e) {
        const errorElt = error();
        booksContainer.appendChild(errorElt);
        const reload = (e) => {
            window.removeEventListener("online", reload);
            e.preventDefault();
            errorElt.remove();
            load();
        }
        window.addEventListener("online", reload);
        errorElt.querySelector(".js-reload").addEventListener("click", reload); 
    }
    spinner.remove();
}

function error() {
    const div = document.createElement("div");
    div.appendChild(
        document.importNode(document.getElementById("error").content, true)
    );
    return div;
}

function loader() {
    const container = document.createElement("div");
    container.appendChild(
        document.importNode(document.getElementById("loader").content, true)
    );
    return container;
}

function generateBookPreview(book) {
    const library = document.createElement("div");
    library.appendChild(
        document.importNode(document.getElementById("card").content, true)
    );
    library.querySelector(".js-body").innerText = book.body;
    library.querySelector(".js-title").innerText = book.title;
    return library;
}

load();