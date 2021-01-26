class UsersViewer {
    constructor() {
        this.apiUrl = 'https://jsonplaceholder.typicode.com/users';

        this.init();
        this.initSearch();
        this.initSort();
    }

    // fetch users from the api and populate the user list
    init() {
        console.log('=== Init UsersViewer');

        $.get(this.apiUrl, data => {
            this.users = data;

            this.populateList()
        }).fail(() => {
            console.log('=== Data could not be fetched !')
        });
    }

    // repopulate the list when a search query is entered
    initSearch() {
        $('[name=searchQuery]').on('keyup', () => {
            console.log('=== Search by query');
            this.populateList();
        })
    }

    // sort element when the sorting dropdown changes
    initSort() {
        $('[name=sortBy]').on('change', () => {
            console.log('=== Sort users!');
            this.populateList();
        })

    }

    // expand/unexpand on mobile view
    initExpanders() {
        $('.expander').on('click', e => {
            const element = $(e.target).closest('.expander-container').find('.expander');
            const toExpand = !element.closest('.expander-container').find('.expanded').length;

            // unexpand everything
            $('.expanded').removeClass('expanded');
            $('.expanded-card').removeClass('expanded-card');
            $('i.fa-chevron-up').attr('class', 'fas fa-chevron-down');

            // toggle expand
            if (toExpand) {
                element.closest('.expander-container').find('.expander-content').addClass('expanded');
                element.closest('.card').addClass('expanded-card');
                element.find('i').attr('class', 'fas fa-chevron-up');
            }
        })
    } 

    // get the searching query and the sorting attribute
    getFilters() {
        return {
            searchQuery: $('[name=searchQuery]').val(),
            sortBy: $('[name=sortBy]').val()
        }
    }

    filterItems() {
        const filters = this.getFilters();

        let filteredUsers = this.users
        // filter the item by search query
        .filter((user, index) => {
            return filters.searchQuery === '' ||
                user.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                user.phone.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                user.address.city.toLowerCase().includes(filters.searchQuery.toLowerCase())
        })
        // sort the items
        .sort((a, b) => {
            a.city = a.address.city;
            b.city = b.address.city;

            return a[filters.sortBy].localeCompare(b[filters.sortBy]);
        });

        return filteredUsers;
    }

    populateList() {
        const filteredUsers = this.filterItems();

        var list = '';
        filteredUsers.forEach((user) => {
            list += `
                <div class="col my-4">
                    <div class="card text-center">
                        <img src="https://picsum.photos/300/200?random=${user.id}" class="card-img-top">
                        <div class="card-body">
                            <div class="user-info">
                                <div class="mb-md-4 mb-lg-0"><strong>${user.name}</strong></div>
                                <div><i class="fas fa-envelope"></i> ${user.email}</div>
                            </div>
                            <div class="card-hover visually-sm-hidden">
                                <div><i class="fas fa-city"></i> ${user.address.city}</div>
                                <div><i class="fas fa-mobile-alt"></i> ${user.phone}</div>
                            </div>
                        </div>
                        <div class="expander-container">
                            <div class="expander-content">
                                <div><i class="fas fa-city"></i> ${user.address.city}</div>
                                <div><i class="fas fa-mobile-alt"></i> ${user.phone}</div>
                            </div>
                            <div class="expander">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        if (!filteredUsers.length) list = '<div class="text-center">No user available!</div>';

        $('.users-list').html(list);

        this.initExpanders();
    }


}

$(() => {
    new UsersViewer();
})