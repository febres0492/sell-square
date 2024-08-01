import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import SearchBar from "../components/SearchBar";
import Cart from "../components/Cart";
import SearchResults from "../components/SearchResults";

const Home = () => {
    return (
        <div className="container-fluid pt-4">
            < CategoryMenu />
            < SearchBar />
            < SearchResults />
        </div>
    );
};

export default Home;
