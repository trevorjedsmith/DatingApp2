namespace DatingApp.Api.Helpers
{
    public class PaginationHeader
    {
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }

        public PaginationHeader(int currentPage, int itemsPerPage, int totalPages, int totalItems)
        {
            this.ItemsPerPage  = itemsPerPage;
            this.TotalPages = totalPages;
            this.TotalItems = totalItems;
            this.CurrentPage = currentPage;
        }
    }
}