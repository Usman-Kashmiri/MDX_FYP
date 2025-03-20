<?php
namespace Database\Seeders;
use App\Models\Roles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
class RoleSeedeer extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (count(Roles::all()) == 0) {
            Roles::create([
                "name" => "SuperAdmin"
            ]);
            Roles::create([
                "name" => "Admin"
            ]);
            Roles::create([
                "name" => "Lawyer"
            ]);
            Roles::create([
                "name" => "Client"
            ]);
            Roles::create([
                "name" => "User"
            ]);
        }
    }
}
