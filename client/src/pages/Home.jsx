import CategoryMenu from "../components/CategoryMenu";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

const Home = () => {
    return (
        <div className="container-fluid">
            < SearchBar />
            < CategoryMenu />
            < SearchResults />
        </div>
    );
};

export default Home;
