const {PrismaClient} = require('@prisma/client');

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                {
                    name: "Web Development"
                },
                {
                    name: "Mobile Development"
                },
                {
                    name: "Data Science"
                },
                {
                    name: "Artificial Intelligence"
                },
                {
                    name: "Machine Learning"
                },
                {
                    name: "Cybersecurity"
                },
                {
                    name: "Game Development"
                },
                {
                    name: "DevOps"
                },
                {
                    name: "Quality Assurance"
                },
                {
                    name: "Software Engineering"
                },
                {
                    name: "Other"
                }
            ]
        });
        console.log("Categories seeded successfully");
    } catch (error) {
        console.log("Error seeding database categories: ", error);
    }finally{
        await db.$disconnect(); //cierra la conexion a la base de datos para evitar que se quede abierta
    }
}

main(); //ejecuta la funcion main