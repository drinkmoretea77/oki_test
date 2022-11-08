const prefix = `/a/interview`;

const interview = {
    import_file: `${prefix}/import/parse`,
    create_question: '/interview/{id}/create_question',
    edit_question: '/question/{id}/edit',
    remove_question: '/question/{id}/delete',
    create_answer: '/question/{id}/create_answer',
    build_datetime: '/anketa/{comp_id}/build_datetime',
    edit_answer: '/answer/{id}/edit',
    remove_answer: '/answer/{id}/delete',
    move_question: '/interview/{interview_id}/question/{question_id}/move/{to}',
    move_answer: '/question/{quest_id}/answer/{id}/move/{to}',
    start_bp: '/answer/{id}/start_bp',
    save_tags: '/answer/{id}/set_tags',
    block: '/anketa/{comp_id}/{anketa_id}/user_action/{code}',
    close: '/anketa/{comp_id}/{anketa_id}/close',
}

export default interview;
