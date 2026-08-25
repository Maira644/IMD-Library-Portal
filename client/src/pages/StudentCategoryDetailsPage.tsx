import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { getCategory } from "@/api/category";

import { DataTable, type DataTableColumn } from "@/components/tables/DataTable";
import {
    BookOpen,
    GraduationCap,
    FolderOpen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function StudentCategoryDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState<any>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [thesis, setThesis] = useState<any[]>([]);
    const navigate = useNavigate();

    const isBookId = id?.startsWith("BK-");

    useEffect(() => {
        if (isBookId && id) {
            navigate(`/student/books/${id}`, { replace: true });
        }
    }, [id, isBookId, navigate]);

    useEffect(() => {
        if (id && !isBookId) {
            loadCategory();
        }
    }, [id, isBookId]);

    async function loadCategory() {
        try {
            if (!id) return;
            const data = await getCategory(id);
            setCategory(data.category);
            setBooks(data.books);
            setThesis(data.thesis);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (isBookId) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                <p className="mt-3 text-sm">Loading category...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <FolderOpen className="mb-3 h-10 w-10 opacity-40" />
                <p className="font-medium">Category not found.</p>
            </div>
        );
    }

    const bookColumns: DataTableColumn<any>[] = [
        { key: "title", header: "Title", sortable: true },
        { key: "author", header: "Author", sortable: true },
        { key: "publisher", header: "Publisher" },
        { key: "publicationYear", header: "Year", sortable: true },
    ];

    const thesisColumns: DataTableColumn<any>[] = [
        { key: "title", header: "Title", sortable: true },
        {
            key: "studentRollNos",
            header: "Students",
            render: (thesis) => thesis.studentRollNos?.join(", ") || "",
        },
        { key: "supervisor", header: "Supervisor" },
        { key: "submissionYear", header: "Year", sortable: true },
    ];

    return (
        <div className="pb-10">
            <Button
                variant="ghost"
                className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/student/categories")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
            </Button>

            <PageHeader
                title={category.name}
                description={category.description}
            />

            <div className="mt-6 rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                    <div className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">
                            Category Information
                        </h2>
                    </div>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Name
                            </dt>
                            <dd className="mt-1 text-sm font-medium">{category.name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Description
                            </dt>
                            <dd className="mt-1 text-sm text-muted-foreground">
                                {category.description || "No description"}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                        </span>
                        <h2 className="text-lg font-semibold">Books</h2>
                        <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {books.length}
                        </span>
                    </div>

                    <DataTable
                        data={books}
                        columns={bookColumns}
                        onRowClick={(book) => navigate(`/student/books/${book.id}`)}
                    />
                </div>

                <Separator />

                <div className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <GraduationCap className="h-4 w-4 text-primary" />
                        </span>
                        <h2 className="text-lg font-semibold">FYDP</h2>
                        <span className="ml-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {thesis.length}
                        </span>
                    </div>

                    <DataTable
                        data={thesis}
                        columns={thesisColumns}
                        onRowClick={(item) => navigate(`/student/thesis/${item.id}`)}
                    />
                </div>
            </div>
        </div>
    );
}