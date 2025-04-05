// src/components/Pagination/Pagination.js
import { useSelector, useDispatch } from 'react-redux';
import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { setPage } from '../redux/slices/gameSlice';
import './Pagination.css';

function Pagination() {
  const dispatch = useDispatch();
  const { page, count } = useSelector(state => state.games);
  const pageSize = 20; // Games per page from RAWG API
  const totalPages = Math.ceil(count / pageSize);
  
  // Limit the number of page items to display
  const maxVisiblePages = 5;
  
  const handlePageChange = (selectedPage) => {
    dispatch(setPage(selectedPage));
    window.scrollTo(0, 0); // Scroll to top when page changes
  };
  
  // Create array of page items to show
  const getPageItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <BootstrapPagination.Item
        key={1}
        active={page === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </BootstrapPagination.Item>
    );
    
    // Calculate start and end pages to show
    let startPage = Math.max(2, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push(<BootstrapPagination.Ellipsis key="ellipsis-start" disabled />);
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <BootstrapPagination.Item
          key={i}
          active={page === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </BootstrapPagination.Item>
      );
    }
    
    // Add ellipsis if there are more pages
    if (endPage < totalPages - 1) {
      items.push(<BootstrapPagination.Ellipsis key="ellipsis-end" disabled />);
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          active={page === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }
    
    return items;
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="pagination-container">
      <BootstrapPagination>
        <BootstrapPagination.Prev
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        />
        
        {getPageItems()}
        
        <BootstrapPagination.Next
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        />
      </BootstrapPagination>
    </div>
  );
}

export default Pagination;