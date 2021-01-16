import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Game } from 'src/games/entities/game.entity'
import { Track } from 'src/tracks/entities/track.entity'
import { Repository } from 'typeorm'
import { CreatePlaylistDto } from './dto/create-playlist.dto'
import { UpdatePlaylistDto } from './dto/update-playlist.dto'
import { Playlist } from './entities/playlist.entity'

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track) readonly trackRepository: Repository<Track>,
    @InjectRepository(Game) readonly gameRepository: Repository<Game>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const games =
      createPlaylistDto.games &&
      (await Promise.all(
        createPlaylistDto.games.map((id) => this.findGameById(id)),
      ))

    const tracks =
      createPlaylistDto.tracks &&
      (await Promise.all(
        createPlaylistDto.tracks.map((id) => this.findTrackById(id)),
      ))

    const playlist = this.playlistRepository.create({
      ...createPlaylistDto,
      games,
      tracks,
    })

    return this.trackRepository.save(playlist)
  }

  findAll() {
    return this.playlistRepository.find({ relations: ['games', 'tracks'] })
  }

  async findOne(id: number) {
    const playlist = await this.playlistRepository.findOne(id, {
      relations: ['games', 'tracks'],
    })

    if (!playlist) {
      throw new NotFoundException(`Playlist #${id} not found`)
    }
    return playlist
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const games =
      updatePlaylistDto.games &&
      (await Promise.all(
        updatePlaylistDto.games.map((id) => this.findGameById(id)),
      ))

    const tracks =
      updatePlaylistDto.tracks &&
      (await Promise.all(
        updatePlaylistDto.tracks.map((id) => this.findTrackById(id)),
      ))

    const playlist = await this.playlistRepository.preload({
      id,
      ...updatePlaylistDto,
      games,
      tracks,
    })

    if (!playlist) {
      throw new NotFoundException(`Playlist #${id} not found`)
    }

    return this.playlistRepository.save(playlist)
  }

  async remove(id: number) {
    const playlist = await this.playlistRepository.findOne(id)

    return this.playlistRepository.remove(playlist)
  }

  private async findGameById(id: number): Promise<Game> {
    const found = await this.gameRepository.findOne(id)

    if (found) {
      return found
    }

    throw new NotFoundException(`Game #${id} not found`)
  }

  private async findTrackById(id: number): Promise<Track> {
    const found = await this.trackRepository.findOne(id)

    if (found) {
      return found
    }

    throw new NotFoundException(`Track #${id} not found`)
  }
}
