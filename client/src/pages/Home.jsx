import ProductList from "../components/ProductList";
import CategoryMenu from "../components/CategoryMenu";
import SearchBar from "../components/SearchBar";
import Cart from "../components/Cart";
import SearchResults from "../components/SearchResults";

const Home = () => {
    return (
        <div className="container">
            < SearchBar />
            < SearchResults />
            {/* <Cart /> */}
            {/* < CategoryMenu /> */}
            {/* <ProductList /> */}
        </div>
    );
};

export default Home;
