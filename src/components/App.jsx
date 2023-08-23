import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getImage } from 'services/getImage';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';

export const App = () => {
  const [searchText, setSearchText] = useState('');
  const [images, setImages] = useState([]);
  const [selectedLargeImage, setSelectedLargeImage] = useState(null);
  const [alt, setAlt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchText) {
      return;
    }

    const addImages = async () => {
      setIsLoading(true);

      try {
        const { hits } = await getImage(searchText, currentPage);
        if (hits.length === 0) {
          toast.info('Sorry image not found...');
        }

        setImages(prevImages => [...prevImages, ...hits]);

        setIsLoading(false);
      } catch (error) {
        toast.error(`Something went wrong! Error message: ${error.message}`);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    addImages();
  }, [searchText, currentPage]);

  const handleSearch = searchText => {
    setSearchText(searchText);
    setImages([]);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const onCloseModal = () => {
    setSelectedLargeImage(null);
  };

  const handleSelectedImg = (largeImage, alt) => {
    setSelectedLargeImage(largeImage);
    setAlt(alt);
  };

  return (
    <>
      <Searchbar handleSearch={handleSearch} />;
      <ToastContainer autoClose={3000} />
      {images.length > 0 && (
        <ImageGallery images={images} selectedImg={handleSelectedImg} />
      )}
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && <Button onClick={loadMore} />}
      {selectedLargeImage && (
        <Modal
          selectedLargeImage={selectedLargeImage}
          alt={alt}
          onClose={onCloseModal}
        />
      )}
    </>
  );
};
