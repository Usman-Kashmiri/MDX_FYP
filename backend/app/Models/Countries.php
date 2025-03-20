<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Countries extends Model
{
    use HasFactory;
    protected $table = "countries";
    protected $fillable = [
        "name",
        "iso3",
        "iso2",
        "phonecode",
        "capital",
        "currency",
        "currency_symbol",
        "tld",
        "native",
        "region",
        "subregion",
        "timezones",
        "translations",
        "latitude",
        "longitude",
        "emoji",
        "emojiU",
        "flag",
        "wikiDataId"
    ];
}
