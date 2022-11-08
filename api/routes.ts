import user_kpi from "~/api/routes/user_kpi";
import contact from "~/api/routes/contact";
import interview from "~/api/routes/interview";
import sa from "~/api/routes/sa";
import call_scripts from "~/api/routes/call_scripts";
import roles from "~/api/routes/roles";
import reports from "~/api/routes/reports";
import permissions from "~/api/routes/permissions";
import lists from "~/api/routes/lists";
import quality_assurance from "~/api/routes/quality_assurance";
import users from "~/api/routes/users";
import projects from "~/api/routes/projects";
import queues from "~/api/routes/queues";
import links from "~/api/routes/links";
import providers from "~/api/routes/providers";
import dialers from "~/api/routes/dialers";
import chat_channels from "~/api/routes/chat_channels";
import company from "~/api/routes/company";
import expired_objects from "~/api/routes/expired_objects";
import crm from "~/api/routes/crm";

const routes = {
    user_kpi,
    contact,
    interview,
    sa,
    call_scripts,
    roles,
    reports,
    permissions,
    links,
    lists,
    quality_assurance,
    users,
    projects,
    queues,
    providers,
    dialers,
    chat_channels,
    company,
    expired_objects,
    crm
}

export default routes;
