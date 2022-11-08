const contact = {
    get_list: `/contact/show_contact_fields/{mode}`,
    set_order: `/contact/contact_fields/update_order`,
    add_tag: `/contact/comp/{comp_id}/tag/add`,
    remove_tag: `/contact/comp/{comp_id}/tag/{tag_id}/delete`,
}

export default contact;
