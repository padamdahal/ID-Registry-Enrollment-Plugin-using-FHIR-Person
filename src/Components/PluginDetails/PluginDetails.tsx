import i18n from "@dhis2/d2-i18n";
import React, { useEffect, useState } from "react";
import { IDataEntryPluginProps } from "../../Plugin.types";
import { config } from '../../config';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import { Input, Button } from "@dhis2/ui";
export const PluginDetails = ({
    setFieldValue,
    values,

}: IDataEntryPluginProps) => {
    const [searchId, setSearchId] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSearch = () => {
        if (searchId.trim() === "") {
            alert("Please enter National ID");
            return;
        }
        setErrorMsg(null);

        fetchAndSetData(searchId);
    };
    const fetchAndSetData = async (nationalId: string) => {
        try {

            const programUrl = `https://202.166.195.141/fhir/Person?identifier=https://fhir.hmis.gov.np/NamingSystem/national-id|${nationalId}`;
            const response = await fetch(programUrl, {
                method: 'GET',

            });

            if (!response.ok) {
                console.error(`Failed to fetch data for nationalId: ${nationalId}`);
                clearAllFields();
                setErrorMsg("Failed to fetch data. Please try again.");

                return;
            }

            const data = await response.json();

            if (!data.entry || data.entry.length === 0) {
                clearAllFields();
                setErrorMsg("No data found for the given National ID.");

                return;
            }
            const person = data.entry[0].resource;
            const birthDateNp = adToBs(person.birthDate)
            const birthDate = new Date(person.birthDate);
            const today = new Date();

            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            let days = today.getDate() - birthDate.getDate();

            if (days < 0) {
                months -= 1;
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
                days += prevMonth;
            }
            if (months < 0) {
                years -= 1;
                months += 12;
            }
            if (person.name && person.name.length > 0) {

                setFieldValue({
                    fieldId: "givenname",
                    value: person.name[0].given?.[0] || "",
                });
                setFieldValue({
                    fieldId: "lastname",
                    value: person.name[0].family || "",
                });
            }

            if (person.birthDate) {

                setFieldValue({
                    fieldId: "birthDate",
                    value: {
                        date: birthDateNp,
                        years: years.toString(),
                        months: months.toString(),
                        days: days.toString(),
                    },
                });
            }

            if (person.telecom) {
                const { phone, email } = person.telecom.reduce(
                    (acc: { phone?: string; email?: string }, t: any) => {
                        if (t.system === "phone") acc.phone = t.value;
                        if (t.system === "email") acc.email = t.value;
                        return acc;
                    },
                    {}
                );

                if (phone) {
                    setFieldValue({
                        fieldId: "phone",
                        value: phone || "",
                    });
                }

                if (email) {
                    setFieldValue({
                        fieldId: "email",
                        value: email || "",
                    });
                }

                setFieldValue({
                    fieldId: "nationalId",
                    value: searchId || "",
                });
            }
            setErrorMsg(null);


        } catch (error) {
            console.error("Error fetching data:", error);
            setErrorMsg("Error fetching data. Please check your connection.");
            clearAllFields();
        }
    };

    const clearAllFields = () => {
        setFieldValue({ fieldId: "givenname", value: "" });
        setFieldValue({ fieldId: "lastname", value: "" });
        setFieldValue({ fieldId: "birthDate", value: "" });
        setFieldValue({ fieldId: "phone", value: "" });
        setFieldValue({ fieldId: "email", value: "" });
    };

    // useEffect(() => {

    //                 fetchAndSetData(nationalId);

    //     // if (values.nationalId) {
    //     //     fetchAndSetData(values.nationalId);
    //     // }
    // }, [nationalId]); 

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    width: "100%",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ flex: 1, width: "700px" }}>
                    <Input
                        type="text"
                        placeholder="Enter National ID"
                        value={searchId}
                        onChange={({ value }) => setSearchId(value)}
                    />
                </div>
                <Button onClick={handleSearch} primary>
                    खोज्नुहोस्        </Button>


            </div>
            {errorMsg && (
                <p style={{ color: "red",  fontSize: "14px",  padding: "20px"}}>
                    {errorMsg}
                </p>
            )}
        </div>



    );
}
