// This app serves a single family, so the family_id every table row carries
// is a fixed constant rather than something users pick or manage.
export const FAMILY_ID = "6d763dc2-3a46-419c-a325-471d703380cc";

// The only account allowed to remove people from the tree. Other family
// members can view/add/claim, but cleanup is admin-only.
export const OWNER_USER_ID = "75b2e436-480f-42c7-a8dd-90891d7bf5aa";
