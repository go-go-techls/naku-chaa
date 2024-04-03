import TitlebarImageList from "@/components/TitlebarImageList";
import Header from "../components/Header";
import ImageBox from "../components/ImageBox";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="flex flex-wrap justify-between space-x-4">
        <div className="w-full md:w-1/2">
          <ImageBox />
        </div>
        <div className="w-full md:w-1/2">
          <TitlebarImageList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
