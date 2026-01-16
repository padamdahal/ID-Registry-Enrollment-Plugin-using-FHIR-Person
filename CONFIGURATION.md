# ID Registry Enrollment Plugin using FHIR Person

This plugin allows you to enroll and manage National ID data in DHIS2 using **FHIR Person** attributes. It connects DHIS2 tracked entities to an external ID registry via configurable API settings.

---

## Plugin Overview

- **Plugin Name:** ID Registry Enrollment Plugin
- **Purpose:** Synchronize DHIS2 Tracked Entity Instances with National ID registry.
- **Scope:** Sandbox plugin — only accesses attributes you explicitly configure.
- **Supported Attributes:**
  | DHIS2 Attribute | Plugin  Attribute |
  |-----------------|----------------|
  | GEN - National ID | nationalId |
  | GEN - Given Name | givenName |
  | GEN - Last Name  | lastName |
  | GEN - Date of Birth | birthDate |
  | GEN - Contact Number | phone |
  | GEN - Email Address | email |

---

## DHIS2 Datastore Configuration

To configure the plugin, store the following in DHIS2 **datastore**:

- **Datastore Name:** `Id-registry-plugin`
- **Key Name:** `settings`
- **Sample JSON:**

```json
{
  "identifier": "",
  "password": "",
  "url": "https://your-fhir-server-api",
  "username": ""
}
